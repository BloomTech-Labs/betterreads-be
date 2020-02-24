const faker = require('faker');

const createFakeBooks = () => ({
	googleId: `${faker.address.longitude()}`,
	title: faker.commerce.product(),
	author: faker.name.firstName(),
	publisher: faker.company.companyName(),
	publishDate: `${Math.floor(Math.random() * (2020 - 1900 + 1) + 1900)}`,
	description: faker.lorem.sentences(),
	isbn10: `${faker.internet.ip()}`,
	isbn13: `${faker.internet.ip()}`,
	pageCount: faker.random.number(),
	categories: faker.name.jobType(),
	thumbnail: `${faker.image.imageUrl()}`,
	smallThumbnail: `${faker.image.imageUrl()}`,
	language: 'english',
	webRenderLink: `${faker.internet.url()}`,
	textSnippet: faker.lorem.text(),
	isEbook: faker.random.boolean()
});

exports.seed = function(knex) {
	// Deletes ALL existing entries
	return knex('books')
		.truncate()
		.then(function() {
			// Inserts seed entries
			let fakeBooks = [];
			const desiredCount = 50;
			for (let i = 0; i < desiredCount; i++) {
				fakeBooks.push(createFakeBooks(i));
			}
			return knex('books').insert(fakeBooks);
		});
};
