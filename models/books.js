const db = require('../database/db-config.js');

module.exports = {
  findBy,
  add,
  findById
};

function findBy(filter) {
    return db('books').where(filter);
  }
  
  async function add(book) {
    const [id] = await db('books').insert(book).returning('id');
    return findById(id);
  }
  
  function findById(id) {
    return db('books')
      .where({ id })
      .first();
  }

