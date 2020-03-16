module.exports = {
  createUserBook: function(book, userId, favorite, status) {
    return { 
      bookId: book.id,
      userId: userId,
      favorite: favorite,
      readingStatus: status
    }
  },

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
  }

};