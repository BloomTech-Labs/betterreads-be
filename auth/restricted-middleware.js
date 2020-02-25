module.exports = (request, response, next) => {
	if (request.session && request.session.user) {
		next();
	} else {
		response.status(401).json({ message: 'unauthorized' });
	}
};
