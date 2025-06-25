const passport = require('passport');
const jwt = require('jsonwebtoken');
const UserModel = require('../services/userModel'); 

const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    const FRONTEND_BASE_URL = process.env.FRONTEND_URL || 'http://localhost:5173'; 

    if (err) {
      console.error('Google Auth Callback Error:', err);
      return res.redirect(`${FRONTEND_BASE_URL}/login?error=auth_failed&details=${encodeURIComponent(err.message || 'unknown_error')}`);
    }
    if (!user) {
      console.warn('Google Auth Callback: No user returned by Passport.');
      return res.redirect(`${FRONTEND_BASE_URL}/login?error=google_login_failed`);
    }

    try {
      const googleIdFromPassport = user.id;
      const emailFromPassport = user.emails && user.emails.length > 0 
                                ? user.emails[0].value 
                                : user.email; 
      const nameFromPassport = user.displayName || user.name?.givenName || user.name?.familyName || '匿名用戶'; 

      console.log(`Google Auth Callback: User profile received - ID: ${googleIdFromPassport}, Email: ${emailFromPassport}, Name: ${nameFromPassport}`);

      const foundUser = await UserModel.findOrCreateGoogleUser({
        googleId: googleIdFromPassport,
        email: emailFromPassport,
        name: nameFromPassport,
      });

      if (!foundUser) {
        console.error('Google Auth Callback: User findOrCreate failed.');
        return res.redirect(`${FRONTEND_BASE_URL}/login?error=user_sync_failed`);
      }

      console.log('Google Auth Callback: User found or created:', foundUser.email);

      const token = jwt.sign(
        { id: foundUser.id, email: foundUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      console.log('Google Auth Callback: JWT token generated. Redirecting to frontend.');
      return res.redirect(`${FRONTEND_BASE_URL}/?token=${token}`);

    } catch (error) {
      console.error('Google Auth Callback: Internal server error during token generation or user sync:', error);
      res.redirect(`${FRONTEND_BASE_URL}/login?error=server_error&details=${encodeURIComponent(error.message || 'unknown_error')}`);
    }
  })(req, res, next);
};

module.exports = {
  googleAuth,
  googleAuthCallback,
};