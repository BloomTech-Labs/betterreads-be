const router = require("express").Router();
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

const User = require("../models/users");
const bcrypt = require("bcryptjs");
const passwordResetLink = process.env.PASSWORD_RESET_LINK;
const authorize = require("../auth/authPasswordResetToken");
const tokenGenerator = require("./passwordResetTokenGenerator");
const Users = require("../models/users");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/requestreset", (req, res) => {
	const user = { email: req.body.email };
	const token = tokenGenerator(user);
	const msg = {
		from: "betterreadslabs21@gmail.com",
		to: `${ user.email }`,
		subject: "Your Password Reset Link for BetterReads",
		text: `Here is your link to reset your BetterReads password: ${ passwordResetLink }${ token }`
	};
	Users.findBy({ emailAddress: `${ user.email }` })
		.then(user => {
			if(user){
                sgMail.send(msg)
                    .then(() => {
                        res.status(200).json({ message: "Request recieved, a link has been sent to the requested email." });
                    })
                    .catch(({ name, message, stack }) => res.status(500).json({ error: "error sending mail", name, message, stack })); 
            } else { res.status(404).json({ error: "requested user does not exist", user }) }
        })
        .catch(({ name, message, stack }) => res.status(500).json({ error: "error searching for user", name, message, stack }));        
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