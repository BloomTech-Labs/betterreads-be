const db = require("../database/db-config.js");

module.exports = {
	findBooksOnShelf,
	addBooks,
	remove
};

function findBooksOnShelf(shelfId) {
	return db('userBooksOnAShelf as bs')
		.join('books as b', 'bs.bookId', 'b.id')
		.join('userShelves as s', 's.id', 'bs.shelfId')
		.where('shelfId', shelfId)
		.select('b.id', 'b.title','s.shelfName', 's.userId' )
}
// function findBy(filter) {
// 	return db("userBooksOnAShelf").where(filter);
// }

function findById(id) {
	return db('userBooksOnAShelf')
		.where ({ id }).first();
}


async function addBooks(book) {
	const [id] = await db("userBooksOnAShelf")
		.insert(book)
		.returning("id");
	return findById(id);
}



async function remove(bookId) {
	return db("userBooksOnAShelf")
		.where("bookId", bookId)
		.del();
}