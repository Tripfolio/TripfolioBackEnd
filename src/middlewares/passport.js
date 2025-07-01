require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('../services/userModel');

const { GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID } = process.env;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id: googleId, emails, displayName } = profile;
        const email = emails && emails.length > 0 ? emails[0].value : null;

        if (!email) {
          return done(new Error('Google 帳戶沒有提供 Email 地址。'), null);
        }

        const user = await UserModel.findOrCreateGoogleUser({
          googleId,
          email,
          name: displayName,
        });
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);
