module.exports = function validatePassword(passWord) {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!regex.test(passWord)) {
    return '密碼需至少有8個字元，包含數字與英文字母';
  }
  return null;
};
