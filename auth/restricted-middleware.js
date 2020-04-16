const secret = require("../config/secrets").jwtSecret
const jwt = require("jsonwebtoken")

module.exports = (request, response, next) => {
    const token = request.headers.authorization
    if (token && jwt.verify(token, secret)){
        next()
    } else {
        response.status(401).json({ message: "log in, first" })
    }
};
