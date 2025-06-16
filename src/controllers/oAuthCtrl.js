const passport = require("../middlewares/passport");

const googleAuth = (req, res) => {
  passport.authenticate("google", { scope: ["email", "profile"] })(req, res);
};

const googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect("/auth/google"); // 沒登入成功就導回去

    // 登入成功：把 user 資料傳到前端
    // const userData = encodeURIComponent(JSON.stringify(user));
    res.redirect(`http://localhost:5173/profile`);
  })(req, res, next);
};

module.exports = {
  googleAuth,
  googleAuthCallback,
};
