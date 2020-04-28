const jwt = require("jsonwebtoken");
const { jwtSecret2 } = require("../config/secrets");

module.exports = function tokenGenerator(req, res){
    const { user } = req.body;
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
    const secret = jwtSecret2;
    const options = {
        expiresIn: "24h"
    }
    // return jwt.sign(payload, secret, options)
    res.redirect("http://localhost:3000?token=" + jwt.sign(payload, secret, options));
};