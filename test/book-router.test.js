const server = require("../api/server.js");
const request = require("supertest");
const db = require("../database/db-config.js");

describe("book-router", function() {
	let token;
	beforeEach(async function() {
		await db("users").truncate();
		return request(server)
			.post("/api/auth/signup")
			.send({
				email: "seedemail",
				password: "seedpassword"
			})
			.then(res => {
				token = res.body.token;
			})
	});

	describe("GET api/books/1", function() {
		it("GET book success status", function() {
			return request(server)
				.get("/api/books/1").set('authorization', token)
				.expect(200);
		});

		it("GET JSON book object", function() {
			return request(server)
				.get("/api/books/1").set('authorization', token)
				.then(res => {
					expect(res.type).toMatch(/json/i);
				})
		});
	});
});
