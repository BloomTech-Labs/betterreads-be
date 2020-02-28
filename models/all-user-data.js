const db = require("../database/db-config.js");

module.exports = {
	findByUserId
};

function findByUserId(id) {
    return db("users")    
    .where({id}) 
    .select("id", "fullName", "emailAddress")
    .first()
    .then(user => {
        return db("userShelves as us")
        .where( "us.userId", id)
        .join("userBooksOnAShelf as ubs", "ubs.shelfId", "us.id" )
        .select("ubs.bookId", "us.shelfName", "us.id as ShelfId")
        .then(userShelves => {
            return db("userBooks as ub")
            .where("ub.userId", id)
            .join("books", "books.id", "ub.bookId")
            .select("*")
            .then( books => {
                return {
                    ...user, userShelves, books
                }
            } )
          
        })
    })
}


