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


function findById(genreId) {
	return db("userGenre").where({ genreId });
}
function add(genre) {
    return db("userGenre")
        .insert(genre)
        .returning("*")
}


  function update(updatedGenre, userId, genreId) {
    return db("userGenre")
    .update(updatedGenre)
    .where({userId} && {genreId})
}

function remove(userId, genreId) {
    return db("userGenre")
        .where({userId} && {genreId})
		.del();
}
