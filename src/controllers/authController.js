const bcrypt = require('bcrypt');
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

    console.log('收到註冊資料：', { name, email, password });

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
      console.log('existingUser:', existingUser);
      if (existingUser) {
        errors.push('Email 已被註冊');
      }
    }

    if (errors.length > 0) {
      console.log('驗證錯誤：', errors);
      return res.status(HTTP.BAD_REQUEST).json({ errors });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const insertResult = await UserModel.createUser({
      name,
      email,
      password: hashedPassword,
    });
    console.log('insertResult:', insertResult);

    if (!insertResult || insertResult.length === 0) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ errors: ['建立使用者失敗'] });
    }

    const userId = insertResult[0]?.id;
    console.log('userId:', userId);

    if (!userId) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ errors: ['無法取得使用者 ID'] });
    }

    await db.insert(emails).values({ userId });

    await notifyRegister(userId);

    return res.status(HTTP.CREATED).json({ message: '註冊成功，請重新登入' });
  } catch (err) {
    console.error('註冊錯誤：', err);
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ errors: ['伺服器錯誤，請稍後再試'] });
  }
};

module.exports = {
  registerUser,
};
