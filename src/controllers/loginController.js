const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../services/userModel');
const { notifyLogin, notifyLoginfail } = require('./notificationCtrl');
require('dotenv').config();
const HTTP = require('../constants/httpStatus');

async function login(req, res) {
  const { email, password } = req.body;
  const errors = [];

  if (!email) errors.push('電子郵件不可為空');
  if (!password) errors.push('密碼不可為空');

  if (errors.length > 0) {
    return res.status(HTTP.BAD_REQUEST).json({ errors });
  }

  try {
    const user = await UserModel.findByEmail(email);

    if (!user) {
      return res.status(HTTP.UNAUTHORIZED).json({ errors: ['此帳號不存在'] });
    }

    if (!user.password) {
      return res.status(HTTP.UNAUTHORIZED).json({ errors: ['此帳號為 Google 登入，請使用 Google 登入'] });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      await notifyLoginfail(user.id);
      return res.status(HTTP.UNAUTHORIZED).json({ errors: ['密碼錯誤'] });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    await notifyLogin(user.id);

    return res.status(HTTP.OK).json({
      message: '登入成功',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ errors: ['伺服器錯誤，請稍後再試'] });
  }
}

module.exports = { login };
