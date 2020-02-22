const router = require('express').Router();
const UserBooks = require('../models/user-books');

router.get('/:userId/library', (req, res) => {
	const userId = req.params.userId;
	UserBooks.findById(userId).then(userbooks => {
		if (userbooks == undefined) {
			res.status(400).json({ message: 'user does not exist' });
		} else {
			res.status(200).json(userbooks);
		}
	})
});