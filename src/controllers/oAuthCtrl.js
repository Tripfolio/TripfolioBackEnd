const passport = require('passport');
const jwt = require('jsonwebtoken');
const UserModel = require('../services/userModel');

const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account',
});

const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    const FRONTEND_BASE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (err) {
      return res.redirect(
        `${FRONTEND_BASE_URL}/login?error=auth_failed&details=${encodeURIComponent(err.message || 'unknown_error')}`,
      );
    }

    if (!user) {
      return res.redirect(`${FRONTEND_BASE_URL}/login?error=google_login_failed`);
    }

    try {
      const googleIdFromPassport = user.id;
      const emailFromPassport = user.emails?.[0]?.value || user.email;
      const nameFromPassport =
        user.displayName || user.name?.givenName || user.name?.familyName || '匿名用戶';

      const foundUser = await UserModel.findOrCreateGoogleUser({
        googleId: googleIdFromPassport,
        email: emailFromPassport,
        name: nameFromPassport,
      });

      if (!foundUser) {
        return res.redirect(`${FRONTEND_BASE_URL}/login?error=user_sync_failed`);
      }

      const token = jwt.sign({ id: foundUser.id, email: foundUser.email }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      return res.redirect(`${FRONTEND_BASE_URL}/login?token=${token}`);
    } catch (error) {
      res.redirect(
        `${FRONTEND_BASE_URL}/login?error=server_error&details=${encodeURIComponent(
          error.message || 'unknown_error',
        )}`,
      );
    }
  })(req, res, next);
};

module.exports = {
  googleAuth,
  googleAuthCallback,
};
