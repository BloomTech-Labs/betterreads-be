module.exports = {

  // MARK: -- UserBooks model
  createUserBook: function(book, userId, favorite, status) {
    return { 
      bookId: book.id,
      userId: userId,
      favorite: favorite,
      readingStatus: status
    }
  },
  // MARK: -- UserBooks model
  addToUserBooks: async function(req, res, Model, userbookObject) {
    await Model.add(userbookObject)
    .then(added => {
      res.status(201).json(added);
    })
    .catch(err => {
      res.status(500).json({
          message: "Error in posting userbook"
      });
    });
  },

  // MARK: -- BooksOnShelf model
  addToUserShelf: async function(req, res, Model, shelfId, bkId) {
    await Model.findBooksOnShelf(shelfId, bkId).then(bookonshelf => {
      if (bookonshelf.length > 0) {
        res.status(500).json({ message: "book is already in user shelf" });
      } else {

        if ((bkId, shelfId)) {
          const bookObj = { bookId: bkId, shelfId: shelfId }
          Model.addBooks(bookObj)
               .then(book => { res.status(200).json({ book, message: " book added to user-shelf" }) })
               .catch(err => { res.status(500).json({ message: "error in adding book to shelf" }) })
        } else {
          res.status(500).json({ message: "book id and shelf id undefined"})
        }
      }
    });
  }

};