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
  const userRating = req.body.userRating;

  UserShelves.findBy(shelfId)
    .first()
    .then((shelf) => {
      const userId = shelf.userId;
      Books.findBy({ googleId })
        .first()
        .then((foundbook) => {
          if (foundbook == undefined) {
            Books.add(book)
              .then((bk) => {
                const newUserBookObject = helper.createUserBook(
                  bk,
                  userId,
                  favorite,
                  status,
                  userRating
                );
                UserBooks.add(newUserBookObject)
                  .then((added) => {
                    const bookId = added.bookId;
                    helper.addToUserShelf(
                      req,
                      res,
                      BooksOnShelf,
                      shelfId,
                      bookId
                    );
                  })
                  .catch(({ name, message, stack }) =>
                    res.status(500).json({
                      message: "could not add book to user library",
                      name,
                      message,
                      stack,
                    })
                  );
              })
              .catch(({ name, message, stack }) =>
                res.status(500).json({
                  error: "could not add book to all books",
                  name,
                  message,
                  stack,
                })
              );
          } else {
            UserBooks.isBookInUserBooks(userId, foundbook.googleId)
              .first()
              .then((inlibrary) => {
                if (inlibrary == undefined) {
                  const userBookObject = helper.createUserBook(
                    foundbook,
                    userId,
                    favorite,
                    status,
                    userRating
                  );
                  UserBooks.add(userBookObject)
                    .then(() => {
                      const bookId = foundbook.id;
                      helper.addToUserShelf(
                        req,
                        res,
                        BooksOnShelf,
                        shelfId,
                        bookId
                      );
                    })
                    .catch(({ name, message, stack }) =>
                      res.status(404).json({
                        error: "could not add to user library",
                        name,
                        message,
                        stack,
                      })
                    );
                } else if (Object.keys(inlibrary).length > 0) {
                  const bookId = inlibrary.bookId;
                  helper.addToUserShelf(
                    req,
                    res,
                    BooksOnShelf,
                    shelfId,
                    bookId
                  );
                } else {
                  res.status(500).json({ message: "unknown error" });
                }
              })
              .catch(({ name, message, stack }) =>
                res.status(404).json({
                  message: "book not in library",
                  name,
                  message,
                  stack,
                })
              );
          }
        })
        .catch(({ name, message, stack }) =>
          res
            .status(404)
            .json({ error: "error finding book", name, message, stack })
        );
    })
    .catch(({ name, message, stack }) =>
      res
        .status(404)
        .json({ error: "could not find shelf", name, message, stack })
    );
});

router.delete("/shelves/:shelfId/:bookId", (req, res) => {
  const shelfId = req.params.shelfId;
  const bookId = req.params.bookId;
  if ((bookId, shelfId)) {
    BooksOnShelf.remove(bookId, shelfId)
      .then((deleted) =>
        res.status(200).json({ message: "book removed from shelf" })
      )
      .catch(({ name, message, stack }) =>
        res.status(500).json({
          error: "error in removing book from shelf",
          name,
          message,
          stack,
        })
      );
  } else {
    res.status(400).json({ message: "Could not delete book on shelf" });
  }
});

router.put("/shelves/:shelfId", (req, res) => {
  const shelfId = req.params.shelfId;
  const bookId = req.body.bookId;
  const newShelfId = req.body.newShelfId;

  if ((bookId, shelfId, newShelfId)) {
    BooksOnShelf.update(bookId, shelfId, newShelfId)
      .then((updated) => {
        if (updated[0].id) {
          res.status(200).json({
            message: "book moved to new shelf",
            newShelfId: updated[0].shelfId,
          });
        } else {
          res
            .status(500)
            .json({ message: "check bookId, shelfId and newShelfId" });
        }
      })
      .catch(({ name, message, stack }) =>
        res.status(500).json({
          error: "error in moving book to shelf",
          name,
          message,
          stack,
        })
      );
  } else {
    res.status(400).json({
      message:
        "Could not update book on shelf, This endpoint requires bookId, shelfId and newShelfId",
    });
  }
});

router.get("/shelves/:shelfId", (req, res) => {
  const shelfId = req.params.shelfId;
  if (shelfId) {
    BooksOnShelf.findBooksIn(shelfId)
      .then((books) => res.status(200).json(books))
      .catch(({ name, message, stack }) =>
        res.status(404).json({
          error: "error in getting books from the shelf",
          name,
          message,
          stack,
        })
      );
  } else {
    res.status(404).json({ message: "no shelf id exist" });
  }
});

// Attempts to fix sending a response before array is completely built
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const asyncForEach = async (info, callback) => {
  for (let i = 0; i < info.array.length; i++) {
    await callback(info.array[i], i, info.array);
  }
};

// This iterates over the information passed in by calling the async forEach created above
// Info is a object containing the userL userId && array: array which is then iterated over
const iterate = async (info) => {
  const temp = [];
  await asyncForEach(info, async (test) => {
    await wait(25);
    BooksOnShelf.findAllBooks(test.id, info.user).then((books) =>
      temp.push(books)
    );
  });
  return temp;
};

router.get("/user/:userId/shelves/allbooks", async (request, response) => {
  const userId = request.params.userId;
  const userShelves = [];

  BooksOnShelf.returnEveryShelfFrom(userId)
    .then((shelves) => {
      iterate({ array: shelves, user: userId }).then((res) => {
        response.status(200).json(res);
      });
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

module.exports = router;
