const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * 寄送 email
 * @param {string} to - 收件者 email
 * @param {string} subject - 主旨
 * @param {string} html - HTML 內容
 */

async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"Tripfolio 通知中心" <${process.env.EMAIL_ACCOUNT}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    return { success: false, message: "郵件發送失敗", error };
  }
}

module.exports = { sendEmail };
