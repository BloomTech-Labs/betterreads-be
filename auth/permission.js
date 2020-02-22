module.exports = (req, res, next) => {
	if(req.userbooks.user_id == req.token.id) {
		next();
	} else {
		res.status(401).json({ message: 'You cannot do that' });
	}
}