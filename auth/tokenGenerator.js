const jwt = require("jsonwebtoken");

const { jwtSecret } = require("../config/secrets");

module.exports = function tokenGenerator(user){
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
    const secret = jwtSecret;
    const options = {
        expiresIn: "24h"
    }
    return jwt.sign(payload, secret, options);
}