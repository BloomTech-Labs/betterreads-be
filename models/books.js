const db = require("../database/db-config.js");

module.exports = {
	findBy,
	getAll,
	add,
    findById,
    del
};

function findBy(filter) {
	return db("books").where(filter);
}

function getAll() {
	return db("books");
}

async function add(book) {
	const [id] = await db("books")
		.insert(book)
		.returning("id");
	return findById(id);
}

function findById(id) {
	return db("books")
		.where({ id })
		.first();
}

function del(filter) {
    return db("books")
        .where(filter)
        .del();
}
