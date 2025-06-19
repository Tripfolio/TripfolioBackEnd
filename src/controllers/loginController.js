const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const { notifyLogin, notifyLoginfail } = require("./notificationCtrl");
require("dotenv").config();

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "此帳號不存在" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      await notifyLoginfail(user.id);
      return res.status(401).json({ message: "密碼錯誤" });
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
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "伺服器錯誤" });
  }
}

module.exports = { login };
