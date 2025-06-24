const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const { notifyLogin, notifyLoginfail } = require("./notificationCtrl");
require("dotenv").config();

async function login(req, res) {
  const { email, password } = req.body;

  const errors = [];

  if (!email) {
    errors.push("電子郵件不可為空");
  }
  if (!password) {
    errors.push("密碼不可為空");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      errors.push("此帳號不存在");
      return res.status(401).json({ errors });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      await notifyLoginfail(user.id);
      errors.push("密碼錯誤");
      return res.status(401).json({ errors });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );
    await notifyLogin(user.id);
    return res.status(200).json({
      message: "登入成功",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("登入時發生伺服器錯誤:", err);
    return res.status(500).json({ errors: ["伺服器錯誤，請稍後再試"] });
  }
}

module.exports = { login };