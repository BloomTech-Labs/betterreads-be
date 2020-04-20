const router = require("express").Router();
const jwt = require("jsonwebtoken");
const mailgun = require("mailgun-js")({ apiKey: process.env.MAILGUN_API_KEY, domain: "sandbox106f22b1455342c49b08c0b8f06b9251.mailgun.org" });
const User = require("../models/users");
const bcrypt = require("bcryptjs")

const jwtSecret = require("../config/secrets");                                         
const passwordResetLink = process.env.PASSWORD_RESET_LINK;
const authorize = require("../auth/authPasswordResetToken")

function tokenGenerator(user){
    const payload = {
        email: user.email,
    }
    const secret = jwtSecret.jwtSecret2
    const options = {
        expiresIn: "15m"
    }
    return jwt.sign(payload, secret, options)
}

router.post("/requestreset", (req, res) => {
    const user = { email: req.body.email };
    const token = tokenGenerator(user);
    console.log("this is the user email", user.email)
    
    const data = {
    	from: 'Readrr Password Reset Team <betterreadslabs21@gmail.com>',
    	to: `${ user.email }`,
    	subject: 'Your Password Reset Link for Readrr',
        text: `Here is your link to reset your Readrr password: ${ passwordResetLink }`
    }
    mailgun.messages().send(data, (error, body) => {
        if (!error){
            res.status(200).json({ message: "Request received, a link has been sent to the requested email.", token  })
        } else {
            res.status(500).json({ message: "Password reset link not sent", error })
        }
    })

});

router.post("/", authorize, (req, res) => {
    const { token, password } = req.body;
    const email = jwt.decode(token, { complete: true }).payload.email;
    const newPassword = bcrypt.hashSync(password, 10)
    User.edit({ password: newPassword }, { emailAddress: email })
        .then(success => res.status(201).json({ message: "Successfully updated user info" }))
        .catch(({ name, message, stack }) => res.status(500).json({ error: "Update to user info failed", name, message, stack }));
})

module.exports = router;