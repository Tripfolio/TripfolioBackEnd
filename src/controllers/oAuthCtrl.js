const passport = require("passport");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleAuthCallback = async (req, res, next) => {
  passport.authenticate("google", { failureRedirect: "/login", session: false }, async (err, user, info) => {
    if (err) {
      return res.redirect(`${process.env.VITE_API_URL}/login?error=auth_failed`);
    }
    if (!user) {
      return res.redirect(`${process.env.VITE_API_URL}/login?error=google_login_failed`);
    }

    try {
      const googleIdFromPassport = user.id;
      const emailFromPassport = user.emails && user.emails.length > 0 ? user.emails[0].value : user.email;
      const nameFromPassport = user.displayName || user.name;

      const foundUser = await UserModel.findOrCreateGoogleUser({
        googleId: googleIdFromPassport,
        email: emailFromPassport,
        name: nameFromPassport,
      });

      if (!foundUser) {
        return res.redirect(`${process.env.VITE_API_URL}/login?error=user_sync_failed`);
      }

      const token = jwt.sign(
        { id: foundUser.id, email: foundUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      return res.redirect(`${process.env.VITE_API_URL}/?token=${token}`);

    } catch (error) {
      res.redirect(`${process.env.VITE_API_URL}/login?error=server_error`);
    }
  })(req, res, next);
};

module.exports = {
  googleAuth,
  googleAuthCallback,
};