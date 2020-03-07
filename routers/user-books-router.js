const router = require("express").Router();
const UserBooks = require("../models/user-books.js");
const Books = require("../models/books.js");

router.get("/:userId/library", (req, res) => {
  const userId = req.params.userId;
  UserBooks.findByUserId(userId)
    .then(userbooks => {
      if (userbooks == undefined) {
        res.status(400).json({ message: "userbooks: does not exist" });
      } else {
        res.status(200).json(userbooks);
      }
    })
    .catch(err => res.status(500).json({ message: "error in returning data" }));
});
//MARK: -- GET ALL BOOK WITH FAVORITE: TRUE
router.get("/:userId/library/favorites", (req, res) => {
  const userId = req.params.userId;
  UserBooks.findByIdFilter(userId )
    .then(userbooks => {
      if (userbooks == undefined) {
        res.status(400).json({ message: "userbooks: does not exist" });
      } else {
        res.status(200).json(userbooks);
      }
    })
    .catch(err => res.status(500).json({ message: "error in returning data" }));
});

router.get("/:userId/library/:id", (req, res) => {
  const userId = req.params.userId;
  const bookId = req.params.id;
  UserBooks.findDetailByUserId(userId, bookId)
    .then(userbook => {
      if (userbook == undefined) {
        res.status(400).json({ message: "userbook: does not exist" });
      } else {
        res.status(200).json(userbook);
      }
    })
    .catch(err => res.status(500).json({ message: "error in returning data" }));
});

router.put("/:userId/library/:id", (req, res) => {
  const userId = req.params.userId;
  const bookId = req.params.id;
  const update = req.body;

  UserBooks.update(userId, bookId, update)

    .then(userbook => {
      if (userbook == undefined) {
        res.status(400).json({
          message: "userbook: does not exist. no change."
        });
      } else {
        res.status(201).json(userbook);
      }
    })
    .catch(err => res.status(500).json({ message: "error in changing data" }));
});

// MARK: -- Delete userbook from library grab id through body
router.delete("/:userId/library/", (req, res) => {
  const userId = req.params.userId;
  const bookId = req.body.id;
  UserBooks.remove(userId, bookId)
    .then(deleted => {
      if (deleted == undefined) {
        res.status(400).json({
          message: "userbook: does not exist. nothing removed."
        });
      } else {
        if (deleted == 0) {
          res.status(500).json({
            message: "deleted == 0, nothing was deleted"
          });
        } else {
          res.status(204).json(deleted);
        }
      }
    })
    .catch(err => res.status(500).json({ message: "error in removing data" }));
});

router.delete("/:userId/library/:id", (req, res) => {
  const userId = req.params.userId;
  const bookId = req.params.id;
  UserBooks.remove(userId, bookId)
    .then(deleted => {
      if (deleted == undefined) {
        res.status(400).json({
          message: "userbook: does not exist. nothing removed."
        });
      } else {
        if (deleted == 0) {
          res.status(500).json({ message: "userbook: not deleted" });
        } else {
          res.status(204).json(deleted);
        }
      }
    })
    .catch(err => res.status(500).json({ message: "error in removing data" }));
});

// MARK: -- REFACTOR, I WILL BREAK THIS DOWN
router.post("/:userId/library", (req, res) => {
  const userId = req.params.userId;
  const book = req.body.book;
  const status = req.body.readingStatus;
  const favorite = req.body.favorite;
  if (book) {
    const googleId = book.googleId;
    // MARK: -- is the book in the user's library already?
    UserBooks.isBookInUserBooks(userId, googleId)
      .then(here => {
        // MARK: -- length == 0, user does not have book in their library
        if (here.length == 0) {
          // MARK: -- check to see if the book in our books database
          Books.findBy({ googleId })
            .first()
            .then(bk => {
              if (bk == undefined) {
                // MARK: -- adding the book to our books db since it is not there
                Books.add(book)
                  .then(book => {
                    const userbookObject = {
                      bookId: book.id,
                      readingStatus: status,
                      userId: userId,
                      favorite: favorite
                    };
                    // MARK: -- adding book to our user's library
                    UserBooks.add(userbookObject)
                      .then(added => {
                        res.status(201).json(added);
                      })
                      .catch(err => {
                        res.status(500).json({
                          message: "Error in posting userbook"
                        });
                      });
                  })
                  .catch(err => {
                    res.status(500).json({
                      message: "Book not added to book db"
                    });
                  });
              } else {
                const userbookObject = {
                  bookId: bk.id,
                  readingStatus: status,
                  userId: userId,
                  favorite: favorite
                };
                // MARK: -- book exist in our books db, add the book to our user's library
                UserBooks.add(userbookObject)
                  .then(added => {
                    res.status(201).json(added);
                  })
                  .catch(err => {
                    res.status(500).json({
                      message: "Error in posting userbook"
                    });
                  });
              }
            });
        } else {
          // MARK: -- user already has the book in their user library
          res.status(200).json({
            message: "Book already exist in your library"
          });
        }
      })
      .catch(nothere => {
        res.status(500).json({ message: "Error in userbook posting" });
      });
  } else {
    // MARK: -- book did not have information provided
    res.status(400).json({ message: "Please provide a book" });
  }
});
// MARK: -- ADDS BOOK TO USER LIBRARY AND SETS FAVORITE TO TRUE
router.post("/:userId/libraryfav", (req, res) => {
  const userId = req.params.userId;
  const book = req.body.book;
  const status = req.body.readingStatus;
  const googleId = req.body.book.googleId

  if (book) {
    const googleId = book.googleId;
    // MARK: -- is the book in the user's library already?
    UserBooks.isBookInUserBooks(userId, googleId)
      .then(here => {
        // MARK: -- length == 0, user does not have book in their library
        if (here.length == 0) {
          // MARK: -- check to see if the book in our books database
          Books.findBy({ googleId })
            .first()
            .then(bk => {
              console.log("here")
              if (bk == undefined) {
                  
                // MARK: -- adding the book to our books db since it is not there
                Books.add(book)
                  .then(book => {
                    const userbookObject = {
                      bookId: book.id,
                      readingStatus: status,
                      userId: userId,
                      favorite: true
                    };
                    // MARK: -- adding book to our user's library
                    UserBooks.add(userbookObject)
                      .then(added => {
                        res
                          .status(201)
                          .json(added);
                      })
                      .catch(err => {
                        res.status(500).json({
                          message: "Error in posting userbook"
                        });
                      });
                  })
                  .catch(err => {
                    res.status(500).json({
                      message: "Book not added to book db"
                    });
                  });
              } else {
                console.log("here")
                const bkId = bk[0].bookId
                const userbookObject = {
                  bookId: bkId,
                  readingStatus: status,
                  userId: userId,
                  favorite: true
                };
               UserBooks.add(userbookObject).then(book => {
                 console.log("book 246 book added to user library favorite: true",book)

                });
              }
            });
        } else if (here[0].favorite == true) {
          console.log("Book Is already in user's library 252")
        
           
            const bkId = here[0].bookId;
            const unfav = {favorite: false}
            console.log("bookId, userId", bkId, userId)
            console.log("here", here)
            UserBooks.update(userId, bkId, unfav)
            .then(userbook => {
              if (userbook == undefined) {
                res.status(400).json({
                  message: "userbook: does not exist. no change."
                });
              } else {
                res
                  .status(201)
                  .json({
                    userbook: userbook,
                    message:
                      "book is already in user's library/ favorite: False"
                  });
              }
            })
            .catch(err =>
              res.status(500).json({ message: "error in changing data 247" })
            );

          } else{
            const bkId = here[0].bookId;
            const fav = {favorite: true}
            UserBooks.update(userId, bkId, fav)
            .then(userbook => {
              if (userbook == undefined) {
                res.status(400).json({
                  message: "userbook: does not exist. no change."
                });
              } else {
                res
                  .status(201)
                  .json({
                    userbook: userbook,
                    message:
                      "book is already in user's library/ favorite: True"
                  });
              }
            })
            .catch(err =>
              res.status(500).json({ message: "error in changing data" })
            );


          }
        
      });
  } else {
    // MARK: -- book did not have information provided
    res.status(400).json({ message: "Please provide a book" });
  }
});

module.exports = router;
