const db = require("../database/db-config.js");

module.exports = {
	findBy,
	add,
	findById,
	findFavorites,
	isBookInUserBooks,
	findByUserId,
	findDetailByUserId,
	update,
	remove
};

function findBy(filter) {
	return db("userBooks").where(filter);
}

async function add(userbook) {
	const [id] = await db("userBooks")
		.insert(userbook)
		.returning("id");
	return findById(id).first();
}

function findById(id) {
	return db("userBooks")
	.where("userBooks.id", id)
	.join("books as b", "b.id", "userBooks.bookId")
	.returning("*")
}


function findFavorites(userId) {
	return db("userBooks").where({ userId }).then(book => {
	const favorites = []
		for (i=0; i< book.length; i++){
			if (book[i].favorite === true){
				favorites.push(book[i])
			}
		}
		return favorites
		
	 
	})
}


function isBookInUserBooks(userId, googleId) {
	return db("userBooks as ub")
		.where({ userId })
		.join("books as b", "ub.bookId", "b.id")
		.where("b.googleId", googleId)
		.select(
			"ub.id as userBooksId",
			"b.googleId",
			"b.title",
			"b.authors",
			"ub.favorite",
			"b.id as bookId"
		);

}

function findByUserId(userId) {
	return db("userBooks as ub")
		.where({ userId })
		.join("books as b", "ub.bookId", "b.id")
		.select(
			"ub.id as userBooksId",
			"b.id as bookId",
			"b.googleId",
			"b.title",
			"b.authors",
			"ub.readingStatus",
			"ub.favorite",
			"b.categories",
			"b.thumbnail",
			"b.pageCount"
		);
}

function findDetailByUserId(userId, bookId) {
	return db("userBooks as ub")
		.where({ 
			userId: userId,
			bookId: bookId
		})
		.join("books as b", "ub.bookId", "b.id")
		.first()
		.select(
			"b.id as bookId",
			"ub.id as userBooksId",
			"b.googleId",
			"b.isbn10",
			"b.isbn13",
			"ub.readingStatus",
			"ub.dateStarted",
			"ub.dateEnded",
			"ub.dateAdded",
			"ub.favorite",
			"b.title",
			"b.authors",
			"b.categories",
			"b.thumbnail",
			"b.pageCount",
			"b.publisher",
			"b.publishedDate",
			"b.description",
			"b.textSnippet",
			"b.language",
			"b.webReaderLink",
			"b.isEbook",
			"b.averageRating"
		);
}

function find(userId, bookId) {
	return db("userBooks")
		.where({ 
			userId: userId, 
			bookId: bookId 
		})
		.first()
}

async function update(userId, bookId, update) {
	await db("userBooks")
		.where({ 
			userId: userId, 
			bookId: bookId 
		})
		.update(update)
	return find(userId, bookId)
}

function remove(userId, bookId) {
	return db("userBooks")
		.where({
		 	userId: userId,
		 	bookId: bookId 
		 })
		.del();
}
