const db = require("../database/db-config.js");

module.exports = {
findBy,
add
};

function findBy(filter) {
	return db("userBooksOnAShelf").where(filter);
}

async function add(book) {
	const [id] = await db("userShelves")
		.insert(book)
		.returning("id");
	return findById(id);
}