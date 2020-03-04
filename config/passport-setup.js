const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/users");
const keys = require("./secrets.js");

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findBy({ id: id }).then(user => {
		done(null, user);
	});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: keys.google.clientID,
			clientSecret: keys.google.clientSecret,
			callbackURL: "/api/auth/google/redirect"
		},
		(accessToken, refreshToken, profile, done) => {
			const userProfile = {
				fullName: profile.displayName,
				emailAddress: profile.emails[0].value,
				image: profile.photos[0].value,
				googleID: profile.id
			};

			User.findBy({ emailAddress: userProfile.emailAddress }).then(
				existingUser => {
					if (existingUser) {
						done(null, existingUser);
					} else {
						User.add(userProfile).then(newUser => {
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
			clientID: keys.facebook.clientID,
			clientSecret: keys.facebook.clientSecret,
			callbackURL: "/api/auth/facebook/redirect",
			profileFields: ["id", "displayName", "photos", "email"]
		},
		(accessToken, refreshToken, profile, done) => {
			const userProfile = {
				fullName: profile.displayName,
				emailAddress: profile.emails[0].value,
				image: profile.photos[0].value,
				facebookID: profile.id
			};

			User.findBy({ emailAddress: userProfile.emailAddress }).then(
				existingUser => {
					if (existingUser) {
						done(null, existingUser);
					} else {
						User.add(userProfile).then(newUser => {
							done(null, newUser[0]);
						});
					}
				}
			);
		}
	)
);
