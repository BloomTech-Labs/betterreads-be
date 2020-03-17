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

  UserShelves.findById(shelfId).then(shelf => {
    const userId = shelf[0].userId;

    Books.findBy({ googleId })
      .first()
      .then(bk => {
        if (bk == undefined) {
          Books.add(book)
            .then(bk => {
              const newUserBookObject = helper.createUserBook(
                bk,
                userId,
                favorite,
                status
              );
              helper.addToUserBook(req, res, UserBooks, newUserBookObject)
            })
            .catch(err => {
              res.status(200).json({
                message: "Book not added to book db"
              });
            });
        } else {
          // MARK: -- book in book db
          UserBooks.isBookInUserBooks(userId, googleId).then(book => {
            if (book.length == 0) {
              Books.findBy({ googleId })
              .first()
              .then(bk => {
                const userBookObject = helper.createUserBook(
                  bk[0],
                  userId,
                  favorite,
                  status
                );
                UserBooks.add(userBookObject)
                  .then(added => {
                    const bkId = added.bookId;
                    helper.addToUserShelf(req, res, BooksOnShelf, shelfId, bkId) 
                  })
                  .catch(err => {
                    res
                      .status(400)
                      .json({ message: "Error in posting userbook" });
                  });
              });
            } else {
              Books.findBy({ googleId })
              .first()
              .then(book => {
                const bkId = book.id;
                helper.addToUserShelf(req, res, BooksOnShelf, shelfId, bkId) 
              });
            }
          });
        }
      });
  });
});

router.delete("/shelves/:shelfId", (req, res) => {
  const userId = req.params.userId;
  const shelfId = req.params.shelfId;
  const bookId = req.body.bookId;
  if ((bookId, shelfId)) {
    BooksOnShelf.remove(bookId, shelfId)
      .then(book => {
        console.log(book);
        if (book === 1) {
          res.status(200).json({ message: "book removed from shelf" });
        } else {
          res.status(400).json({
            message: "there was an error while removing book from shelf"
          });
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
  const bookId = req.body.bookId;

  if (shelfId) {
    BooksOnShelf.findBooksOnShelf(shelfId, bookId)
      .then(book => {
        res.status(200).json(book);
      })
      .catch(err => {
        res.status(500).json({
          message: "error in getting books from the shelf"
        });
      });
  }
});

function createUserBook(bk, userId, favorite, status) {
  return {
    bookId: bk.id,
    userId: userId,
    favorite: favorite,
    readingStatus: status
  };
}

module.exports = router;


