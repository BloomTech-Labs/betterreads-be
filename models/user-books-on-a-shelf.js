const db = require("../database/db-config.js");

module.exports = {
	findBooksOnShelf,
	addBooks,
	remove
};

function findBooksOnShelf(shelfId, bookId) {
	return db('userBooksOnAShelf as bs')
		.join('books as b', 'bs.bookId', 'b.id')
		.join('userShelves as s', 's.id', 'bs.shelfId')
		.where('shelfId', shelfId)
		.where('bs.bookId', bookId)
		.select('bs.bookId', 'b.title','s.shelfName','bs.shelfId', 's.userId' )
}

function findById(id) {
	return db('userBooksOnAShelf')
		.where ({ id }).first().select("*");
}


async function addBooks(book) {
	const [id] = await db("userBooksOnAShelf")
		.insert(book)
		.returning("id");
	return findById(id);
}



async function remove(bookId, shelfId) {
	return db("userBooksOnAShelf")
		.where("bookId", bookId)
		.where("shelfId", shelfId)
		.del();
}