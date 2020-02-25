const db = require('../database/db-config.js');

module.exports = {
	findBy,
	add,
	findById,
	update,
	remove
};

function findBy(filter) {
	return db('userShelves').where(filter);
}

async function add(shelf) {
	const [id] = await db('userShelves').insert(shelf).returning('id');
	return findById(id);
}

function findById(id) {
	return db('userShelves').where({ id })
}

function update(shelf, changes) {
	const [id] =  db('userShelves')
		.where('id', shelf.id)
		.update(changes)
		.returning('id');
	return findById(id);
}

function remove(userId, shelfId) {
	return db('userShelves')
		.where({ userId })
		.where('id', shelfId)
		.del();
}