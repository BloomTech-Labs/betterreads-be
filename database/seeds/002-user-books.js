const user = id => {
	let userbooks = [];
	for (let i = 1; i < Math.floor(Math.random() * 20); i++) {
		const usrbk = {
			bookId: i,
			readingStatus: Math.floor(Math.random() * 3 + 1),
			userId: id
		};
		userbooks.push(usrbk);
	}
	return userbooks;
};

export const fakeUserBooks = [];

const makeFakeUserBooks = user => {
	const desiredCount = 20;
	for (let i = 1; i < desiredCount; i++) {
		fakeUserBooks.push(user(i));
	}
	return fakeUserBooks.flatMap(i => i);
};

exports.seed = function(knex) {
	// Deletes ALL existing entries
	return knex("userBooks")
		.truncate()
		.then(function() {
			// Inserts seed entriee
			return knex("userBooks").insert(makeFakeUserBooks(user));
		});
};
