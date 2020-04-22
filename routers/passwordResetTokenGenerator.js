const jwt = require("jsonwebtoken");

const { jwtSecret2 } = require("../config/secrets");

module.exports = function tokenGenerator(user){
    const payload = {
        email: user.email,
    }
    const secret = jwtSecret2;
    const options = {
        expiresIn: "15m"
    }
    return jwt.sign(payload, secret, options);
}