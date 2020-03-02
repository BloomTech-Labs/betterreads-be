exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('userBooksOnAShelf').truncate()
    .then(function () {
      // Inserts seed entries

      const fakeData = [];
      const desiredCount = 20

      for (let i = 0; i < desiredCount; i++) {
        fakeData.push()
      }
      return knex('userBooksOnAShelf').insert();
    });
};
