const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/users");

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
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
			clientID: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
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
