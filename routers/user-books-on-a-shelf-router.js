const router = require("express").Router();
const BooksOnShelf = require("../models/user-books-on-a-shelf.js");

router.post("/shelves/:shelfId", (req, res) => {
    const shelfId = req.params.shelfId;
    const bookId = req.body.bookId
    const bookObj =
    {
        bookId: bookId,
        shelfId: shelfId
    }

    if (bookId, shelfId) {
        BooksOnShelf.addBooks(bookObj)
            .then(book => {
                console.log(book);
                res.status(200).json(book)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "error in adding book to shelf"
                });
            });
    };
});

router.delete("/shelves/:shelfId/:bookId", (req, res) => {
    const userId = req.params.userId;
    const shelfId = req.params.shelfId;
    const bookId = req.params.bookId;
    if (userId, shelfId) {
        BooksOnShelf.remove(bookId)
            .then(book => {
                console.log(book);
                res.status(200).json({
                    message: "book deleted"
                })
            }).catch(err => {
                        res.status(500).json({
                            message: "error in removing book from shelf"
                        });
                    });
      
    };
})

router.get("/shelves/:shelfId", (req, res) => {
    const shelfId = req.params.shelfId;

    if (shelfId) {
        BooksOnShelf.findBooksOnShelf(shelfId)
            .then(book => {
                console.log(book);
                res.status(200).json(book)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    message: "error in getting books from the shelf"
                });
            });
    };
});
module.exports = router;
