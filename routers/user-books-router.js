const router = require("express").Router();
const UserBooks = require("../models/user-books.js");

router.get("/:userId/library", (req, res) => {
	const userId = req.params.userId;
	UserBooks.findByUserId(userId).then(userbooks => {
		if (userbooks == undefined) {
			res.status(400).json({ message: "userbooks: does not exist" });
		} else {
			res.status(200).json(userbooks);
		}
	});
});

router.get('/:userId/library/:id', (req, res) => {
	const userId = req.params.userId;
	const bookId = req.params.id;
	UserBooks.findDetailByUserId(userId, bookId).then(userbook => {
		if(userbook == undefined) {
			res.status(400).json({ message: 'userbook: does not exist' });
		} else {
			res.status(200).json(userbook);
		}
	});
});

router.put('/:userId/library/:id', (req, res) => {
	const userId = req.params.userId;
	const bookId = req.params.id;
	const rs = req.body.readingStatus
	UserBooks.updateReadingStatus(userId, bookId, rs).then(userbook => {
		if(userbook == undefined) {
			res.status(400).json({ message: 'userbook: does not exist. no change.' });
		} else {
			res.status(201).json(userbook)
		}
	});
});

module.exports = router;