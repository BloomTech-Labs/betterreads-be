const router = require("express").Router();

const Books = require("../models/books");

router.get("/:bookId", (req, res) => {
  const bookId = req.params.bookId;
  Books.findById(bookId)
    .then(book =>
      book == undefined
        ? res.status(404).json({ message: "No books here" })
        : res.status(200).json(book)
    )
    .catch(err => res.status(500).json({ message: "book not found" }));
});

router.post("/", (req, res) => {
  const book = req.body;
  if (book) {
    const title = book.title
    Books.findBy({ title }).first().then(book => {
      res.status(200).json(book);
    })
    .catch(err => {
      Books.add(book)
         .then(book => res.status(201).json({ message: "Could not find book in our api but added it", book: book }) )
         .catch(err => res.status(500).json({ message: "book not added" }));
    }) 
  } else {
      res.status(400).json({ message: 'please provide a book' });
  }
});

module.exports = router;
