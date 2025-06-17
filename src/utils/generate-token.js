const jwt = require("jsonwebtoken");

const payload = { id: 1, email: "test@example.com" };
const secret = '9f0c1d6e4b2a1e0d3f7c8a9b5d6f1234567890abcdef1234567890abcdef1234';
const token = jwt.sign(payload, secret);

console.log("✅ 新 token：", token);