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

// MARK: -- REFACTOR, I WILL BREAK THIS DOWN
router.post("/:userId/library/", (req, res) => {
	const userId = req.params.userId;
	const book = req.body.book;
	const status = req.body.readingStatus;
	if (book) {
		const googleId = book.googleId;
		// MARK: -- is the book in the user's library already?
		UserBooks.isBookInUserBooks(userId, googleId)
			.then(here => {
				console.log("here", here.length);
				// MARK: -- length == 0, user does not have book in their library
				if (here.length == 0) {
					// MARK: -- check to see if the book in our books database
					Books.findBy({ googleId })
						.first()
						.then(bk => {
							if (bk == undefined) {
								// MARK: -- adding the book to our books db since it is not there
								Books.add(book)
									.then(book => {
										console.log(
											"adding book to books db",
											book
										);
										const userbookObject = {
											bookId: book.id,
											readingStatus: status,
											userId: userId
										};
										// MARK: -- adding book to our user's library
										UserBooks.add(userbookObject)
											.then(added => {
												console.log(
													"added to userbooks after adding it to books db",
													added
												);
												res.status(201).json(added);
											})
											.catch(err => {
												res.status(500).json({
													message:
														"Error in posting userbook"
												});
											});
									})
									.catch(err => {
										res.status(500).json({
											message: "Book not added to book db"
										});
									});
							} else {
								console.log(
									"we already have the book and now adding to userbooks db"
								);
								const userbookObject = {
									bookId: bk.id,
									readingStatus: status,
									userId: userId
								};
								// MARK: -- book exist in our books db, add the book to our user's library
								UserBooks.add(userbookObject)
									.then(added => {
										console.log(
											"added book to userbooks after searching for book in db and found it"
										);
										res.status(201).json(added);
									})
									.catch(err => {
										res.status(500).json({
											message: "Error in posting userbook"
										});
									});
							}
						});
				} else {
					// MARK: -- user already has the book in their user library
					res.status(200).json({
						message: "Book already exist in your library"
					});
				}
			})
			.catch(nothere => {
				res.status(500).json({ message: "Error in userbook posting" });
			});
	} else {
		// MARK: -- book did not have information provided
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
