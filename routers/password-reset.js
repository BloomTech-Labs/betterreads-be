const router = require("express").Router();
const jwt = require("jsonwebtoken");
const mailgun = require("mailgun-js")({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });
const User = require("../models/users");
const bcrypt = require("bcryptjs");
                                        
const passwordResetLink = process.env.PASSWORD_RESET_LINK;
const authorize = require("../auth/authPasswordResetToken");
const tokenGenerator = require("./passwordResetTokenGenerator");
const Users = require("../models/users");

router.post("/requestreset", (req, res) => {
	const user = { email: req.body.email };
	const token = tokenGenerator(user);
    
	const data = {
		from: "Readrr Password Reset Team <betterreadslabs21@gmail.com>",
		to: `${ user.email }`,
		subject: "Your Password Reset Link for Readrr",
		text: `Here is your link to reset your Readrr password: ${ passwordResetLink }/${ token }`
	};
	Users.findBy({ emailAddress: `${ user.email }` })
		.then(user => {
			if(user){
				mailgun.messages().send(data, (error, body) => {
					if (!error){
						res.status(200).json({ message: "Request received, a link has been sent to the requested email."  });
					} else {
						res.status(500).json({ message: "Password reset link not sent", error });
					}
				});   
			} else { 
				res.status(404).json({ message: "user does not exist" });
			}
		})
		.catch(({ name, message, stack }) => {
			res.status(500).json({ error: "error finding user", name, message, stack });
		});
});
 

router.post("/", authorize, (req, res) => {
	const { token, password } = req.body;
	const email = jwt.decode(token, { complete: true }).payload.email;
	const newPassword = bcrypt.hashSync(password, 10);
	User.edit({ password: newPassword }, { emailAddress: email })
		.then(success => res.status(201).json({ message: "Successfully updated user info" }))
        .catch(({ name, message, stack }) => {
            res.status(500).json({ error: "Update to user info failed", name, message, stack });
    });
});

module.exports = router;