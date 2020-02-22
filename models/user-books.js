const db = require('../database/db-config.js');

module.exports = {
  findBy,
  add,
  findById,
  update,
  remove
};

function findBy(filter) {
    return db('userBooks').where(filter);
  }
  
async function add(book) {
  const [id] = await db('userBooks').insert(book).returning('id');
  return findById(id);
}
  
function findById(id) {
  return db('userBooks')
    .where({ id })
    .first();
}

async function update(book, readingStatus) {
  const [id] = await db('userBooks').where({ book.id }).update({ readingStatus }).returning('id');
  return findById(id);
}

function remove(id) {
  return db('userBooks').where({ id }).del();
}

