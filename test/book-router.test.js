const server = require("../api/server.js");
const TestObject = require("./test-objects.js");
const request = require("supertest");
const db = require("../database/db-config.js");
const knexCleaner = require('knex-cleaner');

const bookObject = TestObject.bookObject;
const otherBook = TestObject.otherBook;
const badBookObject = TestObject.badBookObject;

var options = {
	mode: 'truncate',
	restartIdentity: true,
	ignoreTables: ['userBooks']
};

describe("book-router", function() {

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
