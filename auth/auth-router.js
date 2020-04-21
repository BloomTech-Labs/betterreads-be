require("dotenv").config();
const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/users.js");
const jwt = require("jsonwebtoken");
const restricted = require("./restricted-middleware");

const userObject = (user) => ({
	id: user.id,
	fullName: user.fullName,
	emailAddress: user.emailAddress,
	image: user.image,
	googleID: user.googleID,
	facebookID: user.facebookID
});

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

const API_FAILURE = process.env.FAIL_URL || "http://localhost:3000/failure"
const API_SUCCESS = process.env.SUCCESS_URL || "http://localhost:3000/success"

// MARK: -- local
router.post("/signup", (request, response) => {
	let user = request.body;
	const hash = bcrypt.hashSync(user.password, 10);
	user.password = hash;
	User.add(user)
		.then(res => {
			response.status(201).json({
				message: "successfully registered user",
				user: userObject(user)
			});
		})
		.catch(({ name, message, stack }) => response.status(500).json({ error: "error registering user", name, message, stack }));
});

router.post("/signin", (request, response) => {
	const { emailAddress, password } = request.body;
	User.findBy({ emailAddress })
		.then(res => {
			if (res && bcrypt.compareSync(password, res.password)) {
                bcrypt.compareSync(password, res.password);
                token = tokenGenerator(res);
				response.status(200).json({
                    message: "successfully logged in",
                    token,
					user: userObject(res)
                });
			} else {
				response.status(400).json({ message: "invalid credentials" });
			}
		})
		.catch(({ name, message, stack }) => response.status(500).json({ error: "error logging in user", name, message, stack }));
});

// MARK: -- google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", { failureRedirect: API_FAILURE }), 
  restricted,
  (request, response) => {
    response.redirect(API_SUCCESS);
  }
);

// MARK: -- facebook
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/redirect",
  passport.authenticate("facebook", { failureRedirect: API_FAILURE }), 
  restricted,
  (request, response) => {
    response.redirect(API_SUCCESS);
  }
);

// router.get(
//   "/okta",
//   passport.authenticate("okta", { scope: ["openid", "email", "profile"] })
// );

// router.get(
//   "/okta/redirect",
//   passport.authenticate("okta", { failureRedirect: API_FAILURE }),
//   (request, response) => {
//     response.redirect(API_SUCCESS);
//   }
// );

// MARK: -- social media only
// router.get("/success", (request, response) => {
//   response.status(200).json({
//     message: "successfully fetched user object",
//   });
// });

// // MARK: -- common
// router.get("/signout", (request, response) => {
// 	request.logout();
// 	if (request.session) {
// 		request.session.destroy(err => {
// 			if (err) {
// 				response.status(500)
// 				.json({ message: "error destroying session" });
// 			} else {
// 				response.status(200)
// 				.clearCookie("bibble")
// 				.json({ message: "successfully signed out" });
// 			}
// 		});
// 	} else {
// 		response.status(204).json({ message: "session does not exist" });
// 	}
// });

module.exports = router;