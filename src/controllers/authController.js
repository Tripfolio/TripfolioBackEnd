const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../services/userModel');
const { emails } = require('../models/emailsSchema');
const { notifyRegister } = require('./notificationCtrl');
const { db } = require('../config/db');
const HTTP = require('../constants/httpStatus');
const SALT_ROUNDS = 10;

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const errors = [];

    if (!email || !password || !name) {
      errors.push('請填寫所有欄位');
    }

    const nameRegex = /^(?!.*[\p{Emoji}])[\s\S]{1,10}$/u;
    if (name && !nameRegex.test(name)) {
      errors.push('名字格式錯誤，請輸入10個字以內，不能包含表情符號');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailRegex.test(email)) {
      errors.push('Email 格式錯誤');
    }

    const passwordRegex = /^.{4,}$/;
    if (password && !passwordRegex.test(password)) {
      errors.push('密碼須至少4字');
    }

    if (email) {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        if (existingUser.password === null) {
          errors.push('此帳號已使用 Google 註冊，請使用 Google 登入');
        } else {
          errors.push('Email 已被註冊');
        }
      }
    }

    if (errors.length > 0) {
      return res.status(HTTP.BAD_REQUEST).json({ errors });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const insertResult = await UserModel.createUser({
      name,
      email,
      password: hashedPassword,
    });

    if (!insertResult || insertResult.length === 0) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ errors: ['建立使用者失敗'] });
    }

    const userId = insertResult[0]?.id;

    if (!userId) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ errors: ['無法取得使用者 ID'] });
    }

    await db.insert(emails).values({ userId });
    await notifyRegister(userId);

    return res.status(HTTP.CREATED).json({ message: '註冊成功，請重新登入' });
  } catch (err) {
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ errors: ['伺服器錯誤，請稍後再試'] });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findByEmail(email);

    if (!user) {
      return res.status(HTTP.UNAUTHORIZED).json({ message: '帳號或密碼錯誤' });
    }

    if (!user.password) {
      return res.status(HTTP.FORBIDDEN).json({ message: '此帳號為 Google 登入帳號，請使用 Google 登入' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(HTTP.UNAUTHORIZED).json({ message: '帳號或密碼錯誤' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(HTTP.OK).json({ token });
  } catch (err) {
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: '登入失敗，請稍後再試' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
