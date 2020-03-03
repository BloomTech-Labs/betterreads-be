const db = require("../database/db-config.js");

module.exports = {
	findBy,
	findByUserId,
	add,
	findById,
	update,
	remove
};

function findBy(filter) {
	return db("userShelves").where(filter);
}

function findByUserId(userId) {
	return db("userShelves")
	.where("userId", userId);
}

async function add(shelf) {
	const [id] = await db("userShelves")
		.insert(shelf)
		.returning("id");
	return findById(id);
}

function findById(id) {
	return db("userShelves").where({ id }).select("*");
}

  function update(updatedShelf, shelfId) {
	return db("userShelves")
	.update(updatedShelf)
	.where("id", shelfId)
}

function remove(shelfId) {
	return db("userShelves")
		.where("id", shelfId)
		.del();
}
