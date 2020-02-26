const router = require("express").Router();
const BooksOnShelf = require("../models/user-books-on-a-shelf.js");

router.post("/:userId/library/:shelfId", (req, res) => {
    const userId = req.params.userId;
    const shelfId = req.params.shelfId;
    const bookId = req.body.bookId
    if (userId, shelfId) {
        BooksOnShelf.add(bookId)
            .then(book => {
                console.log(book);
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: "error in adding book to shelf"
                        });
                    });
                };
            });
