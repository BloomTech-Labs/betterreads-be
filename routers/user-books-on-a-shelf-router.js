const router = require("express").Router();
const BooksOnShelf = require("../models/user-books-on-a-shelf.js");
const UserShelves = require("../models/user-shelves");
const UserBooks = require("../models/user-books");
const Books = require("../models/books.js");

router.post(
  "/shelves/:shelfId/",
  isBookInBookDb,
  isBookInUserBooksDb,
  (req, res) => {
    const shelfId = req.params.shelfId;
    const book = req.body.book;
    const googleId = req.body.book.googleId;
    const status = req.body.readingStatus;

    Books.findBy({ googleId }).then(bk => {
      const bookId = bk[0].id;
      const bookObj = {
        bookId: bookId,
        shelfId: shelfId
      };

      BooksOnShelf.findBooksOnShelf(shelfId, bookId).then(booksOnS => {
        if (booksOnS.length > 0) {
          res.status(500).json({ message: "book is already in user shelf" });
        } else {
          if ((bookId, shelfId)) {
            BooksOnShelf.addBooks(bookObj)
              .then(book => {
                res.status(200).json(book);
              })
              .catch(err => {
                res.status(500).json({
                  message: "error in adding book to shelf"
                });
              });
          }
        }
      });
    });
  }
);

router.delete("/shelves/:shelfId", (req, res) => {
  const userId = req.params.userId;
  const shelfId = req.params.shelfId;
  const bookId = req.body.bookId;
  if ((bookId, shelfId)) {
    BooksOnShelf.remove(bookId, shelfId)
      .then(book => {
        console.log(book);
        if(book === 1){
         res.status(200).json({ message: "book removed from shelf"
          
        }); 
        } else {
          res.status(400).json({message: "there was an error while removing book from shelf"})
        }
        
      })
      .catch(err => {
        res.status(500).json({
          message: "error in removing book from shelf"
        });
      });
  }
});

router.get("/shelves/:shelfId", (req, res) => {
  const shelfId = req.params.shelfId;

  if (shelfId) {
    BooksOnShelf.findBooksOnShelf(shelfId)
      .then(book => {
        console.log(book);
        res.status(200).json(book);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message: "error in getting books from the shelf"
        });
      });
  }
});

function isBookInBookDb(req, res, next) {
  const book = req.body.book;
  const googleId = req.body.book.googleId;

  Books.findBy({ googleId })
    .first()
    .then(bk => {
      if (bk == undefined) {
        Books.add(book)
          .then(bk => {
            console.log({ Book: bk, message: "book added to book db" });
          })
          .catch(err => {
            console.log({
              message: "Book not added to book db"
            });
          });
      } else {
        console.log({ message: "book is already in books DB" });
      }
      next();
    });
}

function isBookInUserBooksDb(req, res, next) {
  const shelfId = req.params.shelfId;
  const reqGoogleId = req.body.book.googleId;
  const status = req.body.readingStatus;

  UserShelves.findById(shelfId).then(shelf => {
    const uId = shelf[0].userId;

    UserBooks.isBookInUserBooks(uId, reqGoogleId).then(bk => {
      if (bk.length == 0) {
        Books.findBy({ googleId: reqGoogleId })
          .then(book2 => {
            const bookId = book2[0].id;
            const userbookObject = {
              bookId: bookId,
              readingStatus: status,
              userId: uId
            };

            UserBooks.add(userbookObject)

              .then(added => {
                console.log({ AddedBook: added });
              })
              .catch(err => {
                console.log({ message: "Error in posting userbook" });
              });
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        console.log({ message: "book is already in user's library" });
      }
    });
    next();
  });
}

module.exports = router;
