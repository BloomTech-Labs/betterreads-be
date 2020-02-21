
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, email: 'remington@steelpreseve.edu', password: 'blahblah'},
      ]);
    });
};
