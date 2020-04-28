const helper = require("./helpers.js");
const router = require("express").Router();
const UserBooks = require("../models/user-books.js");
const Books = require("../models/books.js");
const BooksOnAShelf = require("../models/user-books-on-a-shelf");


// MARK: -- GET
// MARK: -- List
router.get("/:userId/library", (req, res) => {
  const userId = req.params.userId;
  helper.findIn(req, res, UserBooks.findByUserId, userId)
});

// MARK: -- GET ALL BOOK WITH FAVORITE: TRUE
// MARK: -- List favorite
router.get("/:userId/library/favorites", (req, res) => {
  const userId = req.params.userId;
  helper.findIn(req, res, UserBooks.findFavorites, userId)
});

// MARK: -- GET SINGLE BOOK
router.get("/:userId/library/:bookId", (req, res) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;
  UserBooks.findDetailByUserId(userId, bookId)
    .then(userbook => {
      if (userbook == undefined) {
        res.status(400).json({ message: "userbook: does not exist" });
      } else {
        res.status(200).json(userbook);
      }
    })
    .catch(({ name, message, stack }) => res.status(500).json({ error: "error in returning data", name, message, stack }));
});

// MARK: -- PUT
// MARK: -- PUT in list page, for when searching and/or in user library,
router.patch("/:userId/library", (req, res) => {
  const userId = req.params.userId
  const bookId = req.body.bookId

  UserBooks.findDetailByUserId(userId, bookId).then(userBook => {
    const dateEnd = userBook.dateEnded; 
    const dateStart = userBook.dateStarted;
    const status = req.body.readingStatus;
    const favorite = req.body.favorite;
    const rating = req.body.userRating;
    const dateStarted = typeof(req.body.dateStarted) == typeof(String()) ? new Date(req.body.dateStarted) : dateStart
    const dateEnded = typeof(req.body.dateEnded) == typeof(String()) ? new Date(req.body.dateEnded) : dateEnd

  UserBooks.update(userId, bookId, 
    { 
      readingStatus: status, 
      favorite: favorite, 
      dateStarted: dateStarted,
      dateEnded: dateEnded,
      userRating: rating 
    }).then(updated => {
      if(updated == undefined) { 
        res.status(400).json({ message: "cannot update book, not found in library" })
      } else {
        res.status(201).json({ message: "user book updated successfully" })
      }
    }).catch(({ name, message, stack }) => res.status(500).json({ name, message, stack }))
  });
});

// MARK: -- DELETE
// MARK: -- Delete from user library
router.delete("/:userId/library", (req, res) => {
  const userId = req.params.userId;
  const bookId = req.body.bookId;
  UserBooks.remove(userId, bookId).then(deleted => {
    if (deleted == undefined) {
      res.status(400).json({ message: "userbook: does not exist. nothing removed." });
    } else {
      if (deleted == 0) {
        res.status(500).json({ message: "deleted == 0, nothing was deleted" });
      } else {
        BooksOnAShelf.removeAll(bookId, userId).then(removed => {
          if (removed.length > 0){
            res.status(200).json({message: "book deleted from user library"})
          } else {
            res.status(200).json({message: "book deleted from user library"})
          }
        }).catch(({ name, message, stack }) => res.status(404).json({ error: "error removing book from shelf", name, message, stack }))
      } 
    }
    }).catch(({ name, message, stack }) => res.status(500).json({ error: "error in removing data", name, message, stack }));
});

// MARK: -- POST
router.post("/:userId/library", (req, res) => {
  const userId = req.params.userId;
  const book = req.body.book;
  const status = req.body.readingStatus;
  const favorite = req.body.favorite;
  const rating = req.body.userRating;

  if (book) {
    const googleId = book.googleId;
    // MARK: -- is the book in the user's library already?
    UserBooks.isBookInUserBooks(userId, googleId).then(library => {
        // MARK: -- length == 0, user does not have book in their library
        if (library.length == 0) {
          // MARK: -- check to see if the book in our books database
          Books.findBy({ googleId }).first().then(bk => {
            if (bk == undefined) {
              // MARK: -- adding the book to our books db since it is not there
              Books.add(book).then(book => {
                const newUserBookObject = helper.createUserBook(book, userId, favorite, status,rating)
                // MARK: -- adding book to our user's library
                helper.addToUserBooks(req, res, UserBooks, newUserBookObject)
              }).catch(({ name, message, stack }) => res.status(500).json({ message: "Book not added to book db", name, message, stack }));
            } else {
              const userBookObject = helper.createUserBook(bk, userId, favorite, status, rating)
              // MARK: -- book exist in our books db, add the book to our user's library
              helper.addToUserBooks(req, res, UserBooks, userBookObject)
            }
          });
        } else {
          // MARK: -- user already has the book in their user library
          res.status(400).json({ message: "Book already exists in user library" });
        }
      }).catch(({ name, message, stack }) => res.status(500).json({ error: "Error in userbook posting", name, message, stack }));
  } else {
    // MARK: -- book did not have information provided
    res.status(400).json({ message: "Please provide a book" });
  }
});

module.exports = router;