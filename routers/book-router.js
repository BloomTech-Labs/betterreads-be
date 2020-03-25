const router = require("express").Router();
const Books = require("../models/books.js");


router.get("/", (req, res) => {
	Books.getAll()
		.then(book =>
			book == undefined ? res.status(404).json({ message: "No books here" })
							  : res.status(200).json(book)
		)
		.catch(err => res.status(500).json({ message: "Book not found" }));
});

router.get("/:bookId", (req, res) => {
	const bookId = req.params.bookId;
	Books.findById(bookId)
		.then(book =>
			book == undefined ? res.status(404).json({ message: "No books here" })
							  : res.status(200).json(book)
		)
		.catch(err => res.status(500).json({ message: "Book not found" }));
});

router.post("/", (req, res) => {
	const book = req.body;
	if (book) {
		const title = book.title;
		Books.findBy({ title }).first()
		.then(bk => {
			if (bk == undefined) {
				Books.add(book)
					.then(book => res.status(201).json({ message: "Added book to our api", book: book }))
					.catch(err => res.status(500).json({ message: "Book not added" }));
			} else {
				res.status(200).json(bk);
			}
		})
		.catch(err => res.status(500).json({ message: "Error, something went wrong" }));
	} else {
		res.status(400).json({ message: "Please provide a book" });
	}
});

module.exports = router;
