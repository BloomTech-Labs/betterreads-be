const jwt = require('jsonwebtoken');

const { jwtsecret } = require('../config/secrets.js');

module.exports = (req, res, next) => {
	const token = req.headers.authorization;
	if (token) {
		jwt.verify(token, jwtsecret, (err, decodedToken) => {
			if (err) { res.status(401).json({ message: 'Token is not valid' }) } else {
				//req.email = decodedToken.email
				next();
			}
		})
	} else {
		res.status(401).json({ message: 'Authorization please' });
	}
}