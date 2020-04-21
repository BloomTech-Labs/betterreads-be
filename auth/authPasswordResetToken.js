const secrets = require("../config/secrets");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    if (jwt.verify(req.body.token, secrets.jwtSecret2)){
       next()
    } else {
        res.status(401).json({ message: "invalid or expired token" })
    }
}