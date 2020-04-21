const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
// const OktaStrategy = require("passport-okta-oauth").Strategy;
const jwt = require("jsonwebtoken");

const User = require("../models/users");

function tokenGenerator(user){
    const payload = {
        subject: user.id,
        username: user.username,
        role: user.role || "user",
        fullName: user.fullName,
        emailAddress: user.emailAddress,
        image: user.image,
        googleID: user.googleID,
        facebookID: user.facebookID
    }
    const secret = "This is the most secretest secret to ever be secretly secret....... secret."
    const options = {
        expiresIn: "24h"
    }
    return jwt.sign(payload, secret, options)
}
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
			callbackURL: process.env.GOOGLE_CALLBACK || "http://localhost:5000/api/auth/google/redirect"
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
                        const token = tokenGenerator("this is existingUser", existingUser);
						done(null, token);
					} else {
						User.add(userProfile).then(newUser => {
                            console.log("this is newUser", newUser)
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
						done(null, token);
					} else {
						User.add(userProfile).then(newUser => {
                            console.log("this is newUser", newUser);
                            const token = tokenGenerator(newUser[0]);
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