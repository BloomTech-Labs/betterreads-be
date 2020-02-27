const server = require("../api/server.js");
const request = require("supertest");
const db = require("../database/db-config.js");

const knexCleaner = require('knex-cleaner');

var options = {
	mode: 'truncate',
	restartIdentity: true,
	ignoreTables: ['userBooks']
}


describe("user-books-router", function() {

	const bookObject = {
		googleId: "qwoldmcdfiom123103",
		title: "Chantra Swandie",
		author: "McWorld",
		publisher: "Penguin",
		publishDate: "2/21/2020",
		description: "The end of the book",
		isbn10: "12345678911234567891",
		isbn13: "12345678911234567891234",
		pageCount: 210,
		categories: "swenad",
		thumbnail: "image.png",
		smallThumbnail: "small-img.png",
		language: "english",
		webRenderLink: "testLink",
		textSnippet: "testSnippet",
		isEbook: true
	};

	const anotherBookObject = {
		googleId: "1203sodmfo",
		title: "blahr fadwer",
		author: "Glower Pleoq",
		publisher: "Donkey",
		publishDate: "12/21/1992",
		description: "This is the start",
		isbn10: "729287373489282",
		isbn13: "92283843739200200",
		pageCount: 400,
		categories: "werrt",
		thumbnail: "image.png",
		smallThumbnail: "small-img.png",
		language: "russian",
		webRenderLink: "testLink",
		textSnippet: "testSnippet",
		isEbook: false
	};

	const book1 = {
		book: bookObject,
		readingStatus: 1
	};

	const book2 = {
		book: anotherBookObject,
		readingStatus: 3
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
					.then(res => {
						return request(server)
							.post('/api/1/library')
							.send({ book: bookObject, readingStatus: 2 })
							.set("cookie", cookie)
					})
			})
	});

	describe("GET user library", function() {
		it("GET books in user library", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.get("/api/1/library")
					.set("cookie", cookie)
					.then(res => {
						expect(res.body[0].author).toBe("McWorld");
					});
				return req;
			});
		});

		it("Unauthorized GET books in user library", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.get("/api/1/library")
					.then(res => {
						expect(res.status).toBe(401);
					});
				return req;
			});
		});

		it("GET single book from user libary", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.get("/api/1/library/1")
					.set("cookie", cookie)
					.then(res => {
						expect(res.body.title).toBe("Chantra Swandie");
					});
				return req;
			});
		});
	});

	describe("POST user library", function() {
		it("POST book already in library", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.post("/api/1/library")
					.send(book1)
					.set("cookie", cookie)
					.then(res => {
						expect(res.body.message).toBe("Book already exist in your library")
					});
				return req;
			});
		});

		it("POST book object empty", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.post("/api/1/library")
					.send({})
					.set("cookie", cookie)
					.then(res => {
						expect(res.body.message).toBe("Please provide a book")
					});
				return req;
			})
		})

		it("POST new book in user library and book library", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.post("/api/1/library")
					.send(book2)
					.set("cookie", cookie)
					.then(res => {
						expect(res.body[0].bookId).toBe(2)
					});
				return req;
			});
		});
	});

	describe("PUT user library", function() {
		it("PUT status on books", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.put("/api/1/library/1")
					.send({ readingStatus: 1 })
					.set("cookie", cookie)
					.then(res => {
						expect(res.status).toBe(201)
					});
				return req;
			});
		});

		it("PUT status on userbooks", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.put("/api/1/library/1")
					.send({ readingStatus: 1 })
					.set("cookie", cookie)
					.then(res => {
						expect(res.status).toBe(201)
					});
				return req;
			});
		});

		it("PUT status on non-existent userbooks", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.put("/api/1/library/323492")
					.send({ readingStatus: 1 })
					.set("cookie", cookie)
					.then(res => {
						expect(res.status).toBe(500)
					});
				return req;
			});
		});
	});

	describe("DELETE userbook", function() {
		it("DELETE userbook from user's library detail page", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.delete("/api/1/library/1")
					.set("cookie", cookie)
					.then(res => {
						expect(res.status).toBe(204)
					});
				return req;
			});
		});

		it("DELETE userbook from user's library", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.delete("/api/1/library/")
					.send({id: 1})
					.set("cookie", cookie)
					.then(res => {
						expect(res.status).toBe(204)
					});
				return req;
			});
		});

		it("DELETE non-existent userbook from user's library", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.delete("/api/1/library/120394")
					.set("cookie", cookie)
					.then(res => {
						expect(res.status).toBe(500)
					});
				return req;
			});
		});
	});

});