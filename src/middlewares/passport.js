require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("../models/UserModel");

const { GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID, JWT_SECRET, VITE_API_URL } = process.env;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id: googleId, emails, displayName } = profile;
        const email = emails && emails.length > 0 ? emails[0].value : null;

        if (!email) {
          return done(new Error("Google 帳戶沒有提供 Email 地址。"), null);
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

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const initializePassport = (app) => {
  app.use(passport.initialize());
};

module.exports = {
  passport,
  initializePassport,
};