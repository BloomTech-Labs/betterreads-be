const db = require("../database/db-config.js");

module.exports = {
	findBy,
	add,
	update,
	remove
};

function findBy(id) {
	return db("userShelves").where({ id }).select("id as shelfId", "userId", "shelfName", "isPrivate");
}


async function add(shelf) {
	const [id] = await db("userShelves")
		.insert(shelf)
		.returning("id");
	return findBy(id);
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
