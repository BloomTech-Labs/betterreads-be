const faker = require("faker");

const fakeUserShelves = (randomUser) => ({
  userId: randomUser,
  shelfName: `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} ${faker.commerce.product()}`,
  isPrivate: false, 
});

const random = () => {
  return Math.floor(Math.random() * 20 + 1)
}

const fakeShelves = [];

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("userShelves").truncate()
    .then(function () {
      // Inserts seed entries
      const desiredCount = 20;
      for(let i = 0; i < 20; i++) {
        fakeShelves.push(fakeUserShelves(random()))
      }
      return knex("userShelves").insert(fakeShelves);
    });
};
