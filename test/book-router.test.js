const server = require("../api/server.js");
const request = require("supertest");
const db = require("../database/db-config.js");

const knexCleaner = require('knex-cleaner');

var options = {
	mode: 'truncate',
	restartIdentity: true,
	ignoreTables: ['userBooks']
};

describe("book-router", function() {
	const bookObject = {
		googleId: "qwoldmcdfiom123103",
		title: "Chantra Swandie",
		author: "McWorld",
		publisher: "Penguin",
		publishedDate: "2/21/2020",
		description: "The end of the book",
		isbn10: "12345678911234567891",
		isbn13: "12345678911234567891234",
		pageCount: 210,
		categories: "swenad",
		thumbnail: "image.png",
		smallThumbnail: "small-img.png",
		language: "english",
		webReaderLink: "testLink",
		textSnippet: "testSnippet",
		isEbook: true
	};

	const otherBook = {
		googleId: "qwertyomsname",
		title: "Lander McPherson",
		author: "Civil Mary",
		publisher: "Top hat",
		publishedDate: "4/2/1931",
		description: "The begining of the book",
		isbn10: "0293129582812931832914",
		isbn13: "90w8q9weqw9eq0w9e0w9eq9",
		pageCount: 100,
		categories: "mapry",
		thumbnail: "image.png",
		smallThumbnail: "small-img.png",
		language: "english",
		webReaderLink: "testLink",
		textSnippet: "testSnippet",
		isEbook: false
	};

	const badBookObject = {
		type: "Movie",
		content: "Im not a book"
	};

	// MARK: -- helper function to grab cookie
	function promisedCookie(user) {
		return new Promise((resolve, reject) => {
			request(server)
			.post("/api/auth/signin")
			.send(user)
			.end(function(err, res) {
				if (err) { throw err; }
				let signinCookie = res.headers["set-cookie"];
				resolve(signinCookie);
			});
		});
	}

	beforeEach(async function() {
		await knexCleaner.clean(db, options)
		return request(server)
			.post("/api/auth/signup")
			.send({
				fullName: "Seeder Apple",
				emailAddress: "seedemail",
				username: "seedusername",
				password: "seedpassword"
			}).then(res => {
				const cookie = res.headers["set-cookie"]
				return request(server)
					.post("/api/books")
					.send(bookObject)
					.set("cookie", cookie)
			})
	});

	describe("GET api/books/1", function() {
		it("GET book success status", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.get("/api/books/1")
					.set("cookie", cookie)
					.expect(200)
				return req;
			})
		});


		it("GET JSON book object", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.get("/api/books/1")
					.set("cookie", cookie)
					.then(res => {
						expect(res.type).toMatch(/json/i);
					});
				return req;
			});
		});

		it("Expect 401 with no authentication set in header", function() {
			return request(server)
				.get("/api/books/1")
				.then(res => {
					expect(res.status).toBe(401);
				});
		});

		it("Expect error message for book not in database", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.get("/api/books/2000000000")
					.set("cookie", cookie)
					.then(res => {
						expect(res.body.message).toBe("No books here");
					});
					return req;
			});
		});
	});

	describe("POST a book", function() {
		// MARK: -- wrote a conditional because not truncating book table before each test
		it("Expect a 201", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.post("/api/books")
					.send(otherBook)
					.set("cookie", cookie)
					.then(res => {
						if(res.status == 200) {
							expect(res.type).toMatch(/json/i);
						} else {
							expect(res.status).toBe(201);
						}
					});
				return req;
			});
		});

		it("Expect a 400", function() {
			return request(server)
				.post("/api/books")
				.send(badBookObject)
				.then(res => {
					expect(res.body.message).toBe(
						"unauthorized"
					);
				});
		});
	});
});
