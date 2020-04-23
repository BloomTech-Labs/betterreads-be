const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
// const OktaStrategy = require("passport-okta-oauth").Strategy;
const jwt = require("jsonwebtoken");

const User = require("../models/users");
const tokenGenerator = require("../auth/tokenGenerator");

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findBy({ id: id }).then(user => {
		done(null, user);
	});
});

passport.use(
	new GoogleStrategy({ 
			clientID: process.env.GOOGLE_CLIENT_ID, 
			clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
            callbackURL: 
            // process.env.GOOGLE_CALLBACK || 
             "https://api.readrr.app/api/auth/google/redirect"
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
                        console.log(existingUser);
                        const token = tokenGenerator("this is existingUser: ", existingUser);
                        console.log("this is the token: ", token);
						done(null, token);
					} else {
						User.add(userProfile).then(newUser => {
                            console.log("this is newUser: ", newUser);
                            console.log("this is the token : ", token);
                            const token = tokenGenerator(newUser[0])
							done(null, newUser[0]);
						});
					}
				}
			);
		}
	)
);

passport.use(
	new FacebookStrategy({
			 clientID: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
			callbackURL: process.env.FACEBOOK_CALLBACK || "https://api.readrr.app/api/auth/facebook/redirect",
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
                        console.log("this is existing user", existingUser)
                        const token = tokenGenerator(existingUser);
                        console.log("this is the token: ", token)
						done(null, token);
					} else {
						User.add(userProfile).then(newUser => {
                            console.log("this is newUser: ", newUser);
                            const token = tokenGenerator(newUser[0]);
                            console.log("this is the token: ", token)
							done(null, token);
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