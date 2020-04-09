const faker = require("faker");


const createFakeUser = () => ({
	fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
	emailAddress: faker.internet.email(),
	password: faker.internet.password()
});

exports.seed = function(knex) {
	// Deletes ALL existing entries
	return knex("users")
		.truncate()
		.then(function() {
			// Inserts seed entries
			const fakeUsers = [];
			const desiredCount = 50;
			for (let i = 0; i < desiredCount; i++) {
				fakeUsers.push(createFakeUser());
			}
			return knex("users").insert(fakeUsers);
		});
};