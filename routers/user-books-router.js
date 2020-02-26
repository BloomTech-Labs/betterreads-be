const router = require("express").Router();
const UserBooks = require("../models/user-books.js");
const Books = require("../models/books.js");

router.get("/:userId/library", (req, res) => {
	const userId = req.params.userId;
	UserBooks.findByUserId(userId)
		.then(userbooks => {
			if (userbooks == undefined) {
				res.status(400).json({ message: "userbooks: does not exist" });
			} else {
				res.status(200).json(userbooks);
			}
		})
		.catch(err =>
			res.status(500).json({ message: "error in returning data" })
		);
});

// MARK: -- REFACTOR
router.post("/:userId/library/", (req, res) => {
	const userId = req.params.userId;
	const book = req.body.book;
	const status = req.body.readingStatus;
	if (book) {
		const googleId = book.googleId;
		Books.findBy({ googleId })
			.first()
			.then(bk => {
				if (bk == undefined) {
					Books.add(book)
						.then(book => {
							console.log(book);
							const userbookObj = {
								bookId: book.id,
								readingStatus: status,
								userId: userId
							};
							UserBooks.add(userbookObj)
								.then(added => {
									if (added == undefined) {
										res.status(400).json({
											message:
												"userbooks: please provide book"
										});
									} else {
										res.status(201).json(added);
									}
								})
								.catch(err => {
									res.status(500).json({
										message: "error in posting userbook"
									});
								});
						})
						.catch(err =>
							res.status(500).json({ message: "Book not added" })
						);
				} else {
					res.status(200).json(bk);
				}
			})
			.catch(err => {
				res.status(500).json({
					message: "Error, something went wrong"
				});
			});
	} else {
		res.status(400).json({ message: "Please provide a book" });
	}
});

router.get("/:userId/library/:id", (req, res) => {
	const userId = req.params.userId;
	const bookId = req.params.id;
	UserBooks.findDetailByUserId(userId, bookId)
		.then(userbook => {
			if (userbook == undefined) {
				res.status(400).json({ message: "userbook: does not exist" });
			} else {
				res.status(200).json(userbook);
			}
		})
		.catch(err =>
			res.status(500).json({ message: "error in returning data" })
		);
});

router.put("/:userId/library/:id", (req, res) => {
	const userId = req.params.userId;
	const bookId = req.params.id;
	const rs = req.body.readingStatus;
	UserBooks.updateReadingStatus(userId, bookId, rs)
		.then(userbook => {
			if (userbook == undefined) {
				res.status(400).json({
					message: "userbook: does not exist. no change."
				});
			} else {
				res.status(201).json(userbook);
			}
		})
		.catch(err =>
			res.status(500).json({ message: "error in changing data" })
		);
});

// MARK: -- Delete userbook from library grab id through body
router.delete("/:userId/library/", (req, res) => {
	const userId = req.params.userId;
	const bookId = req.body.id;
	UserBooks.remove(userId, bookId)
		.then(deleted => {
			if (deleted == undefined) {
				res.status(400).json({
					message: "userbook: does not exist. nothing removed."
				});
			} else {
				if (deleted == 0) {
					res.status(500).json({
						message: "deleted == 0, nothing was deleted"
					});
				} else {
					res.status(204).json(deleted);
				}
			}
		})
		.catch(err =>
			res.status(500).json({ message: "error in removing data" })
		);
});

router.delete("/:userId/library/:id", (req, res) => {
	const userId = req.params.userId;
	const bookId = req.params.id;
	UserBooks.remove(userId, bookId)
		.then(deleted => {
			if (deleted == undefined) {
				res.status(400).json({
					message: "userbook: does not exist. nothing removed."
				});
			} else {
				if (deleted == 0) {
					res.status(500).json({ message: "userbook: not deleted" });
				} else {
					res.status(204).json(deleted);
				}
			}
		})
		.catch(err =>
			res.status(500).json({ message: "error in removing data" })
		);
});

module.exports = router;
