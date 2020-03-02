const db = require("../database/db-config.js");

module.exports = {
    findBy,
    shelvesFor,
    find,
    findBooksIn
};

// MARK: -- return all books for user
function booksFor(userId) {
    return db("userBooks as ub")
        .where("ub.userId", userId)
        .join("books as b", "b.id", "ub.bookId")
        .select("b.title", "b.author", "b.thumbnail", "b.smallThumbnail", "b.googleId")
}

// MARK: -- return total number of shelves
function numberOfShelvesFor(userId) {
    return db("userShelves as us")
        .where("us.userId", userId)
        .count("us.id")
}


async function find(userId) {
    const shelfId = await shelvesFor(userId)
    const shelvesId = await shelfId.map(shelf => shelf.id)
    return shelvesId.map(async i => {
        return await numberOfBooksOn(i)
    })
}

// MARK: -- return books number of one shelf
function numberOfBooksOn(shelfId) {
    return db("userBooksOnAShelf as ubs")
        .where("shelfId", shelfId)
        .join("books as b", "b.id", "ubs.bookId")
        .count("b.id");
}

// MARK: -- return all shelves for user
function shelvesFor(userId) {
    return db("users as u")
        .where("u.id", userId)
        .join("userShelves as us", "us.userId", "u.id")
        .distinct("us.id").orderBy("us.id")
}

function findBooksIn(shelfId) {
    return db("userBooksOnAShelf as ubs")
        .where("ubs.shelfId", shelfId)
        .select("ubs.bookId")
}

function findBy(userId) {
    return db("users")    
    .where("id", userId) 
    .select("id", "fullName", "emailAddress")
    .first()
    .then(user => {
        return db("userBooksOnAShelf as ubs")
        .join("userShelves as us", "ubs.shelfId", "us.id")
        .where("us.userId", userId)
        .distinct("ubs.shelfId", "us.shelfName")
        .then(userShelves => {
            return db("userBooks as ub")
            .where("ub.userId", userId)
            .join("books", "books.id", "ub.bookId")
            .count("books.id as count")
            .then(allBooks => {
                return db("userBooksOnAShelf as ubs")
                    .join("userShelves as us", "ubs.shelfId", "us.id")
                    .join("books as b", "b.id", "ubs.bookId")
                    .where("us.userId", userId)
                    .select("us.id as shelfId", "us.shelfName", "b.title", "b.author", "b.thumbnail", "b.smallThumbnail")
                    .then(bookWithShelf => {
                        return {
                            ...user, userShelves, booksOnShelves: bookWithShelf, library: allBooks
                        }
                })
            })
          
        })
    })
}
