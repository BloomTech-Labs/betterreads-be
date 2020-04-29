const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
// const OktaStrategy = require("passport-okta-oauth").Strategy;
const jwt = require("jsonwebtoken");

const User = require("../models/users");
const tokenGenerator = require("../auth/tokenGenerator");

passport.serializeUser((user, done) => {
  console.log("user: ", user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findBy({ id: id }).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK ||
        "https://api.readrr.app/api/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      const userProfile = {
        fullName: profile.displayName,
        emailAddress: profile.emails[0].value,
        image: profile.photos[0].value,
        googleID: profile.id,
      };

      User.findBy({ emailAddress: userProfile.emailAddress }).then(
        (existingUser) => {
          if (existingUser) {
            const token = tokenGenerator(existingUser);
            done(null, existingUser);
          } else {
            User.add(userProfile).then((newUser) => {
              const token = tokenGenerator(newUser[0]);
              done(null, newUser[0]);
            });
          }
        }
      );
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL:
        process.env.FACEBOOK_CALLBACK ||
        "https://api.readrr.app/api/auth/facebook/redirect",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      const userProfile = {
        fullName: profile.displayName,
        emailAddress: profile.emails[0].value,
        image: profile.photos[0].value,
        facebookID: profile.id,
      };

      User.findBy({ emailAddress: userProfile.emailAddress }).then(
        (existingUser) => {
          if (existingUser) {
            const token = tokenGenerator(existingUser);
            done(null, existingUser);
          } else {
            User.add(userProfile).then((newUser) => {
              const token = tokenGenerator(newUser[0]);
              done(null, newUser[0]);
            });
          }
        }
      );
    }
  )
);
//Unneeded extra work, no more secure than previous methods
// passport.use(
//     new OktaStrategy(
//       {
//         audience: "OKTA_DOMAIN_HERE",
//         clientID: "OKTA_CLIENT_ID_HERE",
//         clientSecret: "OKTA_CLIENT_SECRET_HERE1",
//         scope: ["openid", "email", "profile"],
//         response_type: "code",
//         callbackURL: "OKTA_LOGIN_REDIRECT_HERE",
//       },
//       (accessToken, refreshToken, profile, done) => {
//         console.log(profile);
//       }
//     )
//   );
