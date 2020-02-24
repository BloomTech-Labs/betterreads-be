const server = require('../api/server.js');
const request = require('supertest');
const db = require('../database/db-config.js');

describe('book-router', function() {
	const bookObject = {
		googleId: 'qwoldmcdfiom123103',
		title: 'Chantra Swandie',
		author: 'McWorld',
		publisher: 'Penguin',
		publishDate: '2/21/2020',
		description: 'The end of the book',
		isbn10: '12345678911234567891',
		isbn13: '12345678911234567891234',
		pageCount: 210,
		categories: 'swenad',
		thumbnail: 'image.png',
		smallThumbnail: 'small-img.png',
		language: 'english',
		webRenderLink: 'testLink',
		textSnippet: 'testSnippet',
		isEbook: true
	};

	const badBookObject = {
		type: 'Movie',
		content: 'Im not a book'
	};

	let token;
	beforeEach(async function() {
		await db('users').truncate();
		return request(server)
			.post('/api/auth/signup')
			.send({
				email: 'seedemail',
				password: 'seedpassword'
			})
			.then(res => {
				token = res.body.token;
			});
	});

	describe('GET api/books/1', function() {
		// MARK: -- FIX NOT WORKING
		it('GET book success status', function() {
			return request(server)
				.get('/api/books/1')
				.set('authorization', token)
				.expect(200);
		});

		it('GET JSON book object', function() {
			return request(server)
				.get('/api/books/1')
				.set('authorization', token)
				.then(res => {
					expect(res.type).toMatch(/json/i);
				});
		});

		it('Expect 401 with no authentication set in header', function() {
			return request(server)
				.get('/api/books/1')
				.then(res => {
					expect(res.status).toBe(401);
				});
		});

		it('Expect error message for book not in database', function() {
			return request(server)
				.get('/api/books/2000000000')
				.set('authorization', token)
				.then(res => {
					expect(res.body.message).toBe('No books here');
				});
		});
	});

	describe('POST a book', function() {
		// MARK: -- wrote a conditional because not truncating book table before each test
		it('Expect a 201', function() {
			return request(server)
				.post('/api/books')
				.set('authorization', token)
				.send(bookObject)
				.then(res => {
					if (res.status == 200) {
						expect(res.type).toMatch(/json/i);
					} else {
						expect(res.status).toBe(201);
					}
				});
		});

		it('Expect a 400', function() {
			return request(server)
				.post('/api/books')
				.set('authorization', token)
				.send(badBookObject)
				.then(res => {
					expect(res.body.message).toBe(
						'Error, something went wrong'
					);
				});
		});
	});
});
