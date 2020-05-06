const router = require("express").Router();
const Books = require("../models/books.js");

router.get("/", (req, res) => {
	Books.getAll()
		.then(book =>
			book == undefined ? res.status(404).json({ message: "No books here" })
							  : res.status(200).json(book)
		)
		.catch(({ name, message, stack }) => res.status(500).json({ error: "Book not found", name, message, stack }));
});

router.get("/:bookId", (req, res) => {
	const bookId = req.params.bookId;
	Books.findById(bookId)
		.then(book =>
			book == undefined ? res.status(404).json({ message: "No books here" })
							  : res.status(200).json(book)
		)
		.catch(({ name, message, stack }) => res.status(500).json({ error: "Book not found", name, message, stack }));
});

router.post("/", (req, res) => {
    const book = req.body;
    //If the body has a book on it
	if (book) {
        const title = book.title;
    //Search for the book in the database by the title
		Books.findBy({ title }).first()
		.then(bk => {
    //If the book is not in the database
			if (bk == undefined) {
    //Add the book to our database
				Books.add(book)
					.then(book => res.status(201).json({ message: "Added book to our api", book: book }))
					.catch(({ name, message, stack }) => {
                        if (message.includes("violates not-null")) {
                            res.status(400).json({ error: "missing a necessary field", name, message, stack })
                        } else {
    //If there is an error other than a not-null exception
                            res.status(500).json({ message: "Book not added", name, message, stack });
                        }
                    });
                    } else {
			        	res.status(400).json({ error: "Book already exists" });
            }})
		.catch(({ name, message, stack }) => {
            if (message.includes("Undefined binding(s) detected")) {
                res.status(400).json({ error: "missing a necessary field", name, message, stack })    
            } else { res.status(500).json({ error: "Error, something went wrong", name, message, stack }) };
        });            
    } else {
		res.status(400).json({ message: "Please provide a book" });
	}
});

module.exports = router;
