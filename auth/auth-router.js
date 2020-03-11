const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/users.js");

const userObject = (user) => ({
	id: user.id,
	fullName: user.fullName,
	emailAddress: user.emailAddress,
	image: user.image,
	googleID: user.googleID,
	facebookID: user.facebookID
});

// MARK: -- local
router.post("/signup", (request, response) => {
	let user = request.body;
	const hash = bcrypt.hashSync(user.password, 10);
	user.password = hash;

	User.add(user)
		.then(res => {
			request.session.user = res[0];
			const user = request.session.user;
			response.status(201).json({
				message: "successfully registered user",
				user: userObject(user)

			});
		})
		.catch(err => {
			console.log(err);
			response.status(500).json({ message: "error registering user" });
		});
});

router.post("/signin", (request, response) => {
	const { emailAddress, password } = request.body;

	User.findBy({ emailAddress })
		.then(res => {
			if (res && bcrypt.compareSync(password, res.password)) {
				request.session.user = res;
				const user = request.session.user;
				response.status(200).json({
					message: "successfully logged in",
					user: userObject(user)
				});
			} else {
				response.status(500).json({ message: "invalid credentials" });
			}
		})
		.catch(err => {
			console.log(err);
			response.status(500).json({ message: "error logging in user" });
		});
});

// MARK: -- google
router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
		prompt: "select_account"
	})
);

router.get(
	"/google/redirect",
	passport.authenticate("google", {
		failureRedirect: `${process.env.BASE_URL}/failure` || "http//localhost:3000/failure"
	}),
	(request, response) => {
		request.session.user = request.user;
		response.redirect(`${process.env.BASE_URL}/success` || "http://localhost:3000/success");
	}
);

// MARK: -- facebook
router.get(
	"/facebook",
	passport.authenticate("facebook", {
		scope: ["email"]
	})
);

router.get(
	"/facebook/redirect",
	passport.authenticate("facebook", {
		failureRedirect: `${process.env.BASE_URL}/failure` || "http://localhost:3000/failure"
	}),
	(request, response) => {
		request.session.user = request.user;
		response.redirect(`${process.env.BASE_URL}/success` || "http://localhost:3000/success");
	}
);

// MARK: -- social media only
router.get("/success", (request, response) => {
	response.status(200).json({
		message: "successfully fetched user object",
		user: request.session.user
	});
});

// MARK: -- common
router.get("/signout", (request, response) => {
	request.logout();

	if (request.session) {
		request.session.destroy(err => {
			if (err) {
				response
					.status(500)
					.json({ message: "error destroying session" });
			} else {
				response
					.status(200)
					.clearCookie("bibble")
					.json({ message: "successfully signed out" });
			}
		});
	} else {
		response.status(204).json({ message: "session does not exist" });
	}
});

module.exports = router;
