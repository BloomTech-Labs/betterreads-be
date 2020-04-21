module.exports = {

  // MARK: -- UserBooks helper (in routers)
  createUserBook: function(book, userId, favorite, status, rating) {
    return { 
      bookId: book.id,
      userId,
      favorite,
      readingStatus: status,
      userRating: rating
    }
  },
  
  
 
  // MARK: -- UserShelves & UserBooks helper (in routers)
  findIn: function(req, res, Action, param, where) {
    Action(param)
      .then(variable => {
        if (variable == undefined) { 
          res.status(400).json({ message: `${where}: does not exist` }) } 
        else { res.status(200).json(variable) }
      })
      .catch(({ name, message, stack }) => res.status(500).json({ error: "error in returning data", name, message, stack }));
  },

  // MARK: -- UserBooks helper (in routers)
  addToUserBooks: async function(req, res, Model, userbookObject) {
    await Model.add(userbookObject)
      .then(added => res.status(201).json(added) )
      .catch(({ name, message, stack }) => res.status(500).json({ error: "Error in posting userbook", name, message, stack } ) )
  },

  // MARK: -- BooksOnShelf helper (in routers)
  addToUserShelf: function(req, res, Model, shelfId, bkId) {
    Model.findBook(shelfId, bkId)
      .then(bookonshelf => {
        if (bookonshelf.length > 0) {
          res.status(400).json({ message: "book is already in user shelf" });
        } else {
          if ((bkId, shelfId)) {
            const bookObj = { bookId: bkId, shelfId: shelfId }
            Model.addBooks(bookObj)
                 .then(book => res.status(200).json({ book, message: "book added to user-shelf" }))
                 .catch(({ name, message, stack }) => res.status(400).json({ 
                    error: "error in adding book to shelf. Book may already exist on shelf.", name, message, stack }
                  ))
          } else {
            res.status(500).json({ message: "book id and shelf id undefined"})
          }
        }
      }).catch(({ name, message, stack }) => res.status(500).json({ error: "error occurred", name, message, stack }))
  }

};