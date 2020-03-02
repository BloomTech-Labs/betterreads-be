import { fakeShelves } from "./002-user-shelves.js";
import { fakeUserBooks } from "./002-user-books.js";

const fakeUserBooksOnAShelf = (randomBook, randomShelf) => ({
   bookId: randomBook,
   shelfId: randomShelf,
})

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
