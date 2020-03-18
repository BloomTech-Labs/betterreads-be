const db = require("../database/db-config.js");

module.exports = {
	findBooksOnShelf,
	findAllBooks,
	addBooks,
	remove,
	removeAll,

};

function findBooksOnShelf(shelfId, bookId) {
	return db('userBooksOnAShelf as bs')
		.join('books as b', 'bs.bookId', 'b.id')
		.join('userShelves as s', 's.id', 'bs.shelfId')
		.where({ shelfId: shelfId })
		.where('bs.bookId', bookId)
		.select('bs.bookId', 'b.title','s.shelfName', 'bs.shelfId', 's.userId' )
}

function findAllBooks(shelfId) {
	return db('userBooksOnAShelf as bs')
		.join('books as b', 'bs.bookId', 'b.id')
		.join('userShelves as s', 's.id', 'bs.shelfId')
		.where({ shelfId: shelfId })
		.select('bs.bookId', 'b.title', 'bs.shelfId', 's.userId' )
		.then(books => {
			return db("userShelves as s")
			 .where({ id: shelfId })
			.select("s.shelfName")
			.first()
			.then(name => {
				console.log(books, name)
				const ShelfName = Object.values(name)[0]
				return {
					ShelfName, books
				}
			})
		})
}



function findById(id) {
	return db('userBooksOnAShelf')
		.where({ id })
		.first()
		.select("*");
}


async function addBooks(book) {
	const [id] = await db("userBooksOnAShelf")
		.insert(book)
		.returning("id");
	return findById(id);
}



function remove(bookId, shelfId) {
	return db("userBooksOnAShelf")
		.where({ bookId: bookId, shelfId: shelfId })
		.del();
}

function removeAll(bookId, userId) {
	return db("userBooksOnAShelf")
	.join("userShelves as us", "userBooksOnAShelf.shelfId", "us.id")
		.where({ bookId })
		.where("us.userId", userId)
		.select("shelfId")
		.then(id => {
			id.map(del => {	
			  remove(bookId, del.shelfId)
			})
			return id
		})
		
}