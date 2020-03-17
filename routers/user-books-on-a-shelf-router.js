const helper = require("./helpers.js");
const router = require("express").Router();
const BooksOnShelf = require("../models/user-books-on-a-shelf.js");
const UserShelves = require("../models/user-shelves");
const UserBooks = require("../models/user-books");
const Books = require("../models/books.js");

router.post("/shelves/:shelfId", (req, res) => {
  const shelfId = req.params.shelfId;
  const book = req.body.book;
  const googleId = req.body.book.googleId;
  const status = req.body.readingStatus;
  const favorite = req.body.favorite;

  UserShelves.findById(shelfId).first().then(shelf => {
    const userId = shelf.userId
    Books.findBy({ googleId }).first().then(foundbook => {
      if (foundbook == undefined) {
        Books.add(book).then(bk => {
          const newUserBookObject = helper.createUserBook(bk, userId, favorite, status);
          UserBooks.add(newUserBookObject).then(added => {
            const bookId = added.bookId
            helper.addToUserShelf(req, res, BooksOnShelf, shelfId, bookId)
          }).catch(err => res.status(500).json({ message: "could not add book to user library" }))
        }).catch(err => { res.status(500).json({ message: "could not add book to all books" })
      })
    } else {
      UserBooks.isBookInUserBooks(userId, foundbook.googleId).first().then(inlibrary => {
        if (inlibrary == undefined) {
          const userBookObject = helper.createUserBook(foundbook, userId, favorite, status);
          UserBooks.add(userBookObject).then(added => {
            const bookId = foundbook.id
            helper.addToUserShelf(req, res, BooksOnShelf, shelfId, bookId)
          }).catch(err => res.status(404).json({ message: "could not add to user library" }))
        } else if (Object.keys(inlibrary).length > 0) {
          const bookId = inlibrary.bookId
          helper.addToUserShelf(req, res, BooksOnShelf, shelfId, bookId)
        } else {
          res.status(500).json({ message: "Aasa's fault" })
        }
      }).catch(err => res.status(404).json({ message: "book not in library" }))
    }
    }).catch(err => res.status(500).json({ message: "error finding book" } ))
  }).catch(err => res.status(404).json({ message: "could not find shelf" } ))
});

router.delete("/shelves/:shelfId", (req, res) => {
  const shelfId = req.params.shelfId;
  const bookId = req.body.bookId;

  if ((bookId, shelfId)) {
    BooksOnShelf.remove(bookId, shelfId)
    .then(deleted => res.status(200).json({ message: "book removed from shelf", deleted: deleted }) )
    .catch(err => res.status(500).json({ message: "error in removing book from shelf", }) )
  } else {
    res.status(400).json({ message: "Could not delete book on shelf" })
  }
});

router.get("/shelves/:shelfId", (req, res) => {
  const shelfId = req.params.shelfId;
  const bookId = req.body.bookId;

  if (shelfId) {
    BooksOnShelf.findBooksOnShelf(shelfId, bookId)
      .then(book => res.status(200).json( book ))
      .catch(err => res.status(500).json({ message: "error in getting books from the shelf" }) )
  } else {
    res.status(404).json({ message: "no shelf id exist" })
  }
});

module.exports = router;


