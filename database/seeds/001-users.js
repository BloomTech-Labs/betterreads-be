const faker = require('faker');

const createFakeUser = () => ({
	email: faker.internet.email(),
	password: faker.internet.password(),
});

exports.seed = function(knex) {
  // Deletes ALL existing entries
	return knex('users').truncate()
	.then(function () {
		  // Inserts seed entries
		let fakeUsers = [];
		const desiredCount = 50;
		for (let i = 0; i < desiredCount; i++) {
		  	fakeUsers.push(createFakeUser());
		}
	  	return knex('users').insert(fakeUsers);
	});
};

