const db = require("../database/db-config.js");

module.exports = {
    findByUserId,
    findById,
	add,
	update,
	remove
};



function findByUserId(userId) {
	return db("userGenre")
	.where( "userGenre.userId", userId );
}


function findById(id) {
	return db("userGenre").where({ id });
}
async function add(genre) {
	const [id] = await db("userGenre")
		.insert(genre)
		.returning("id");
	return findById(id);
}


  function update(updatedGenre, userId) {
	return db("userGenre")
	.update(updatedGenre)
	.where("userId", userId)
}

function remove(userId) {
	return db("userGenre")
        .where("userId", userId)
		.del();
}
