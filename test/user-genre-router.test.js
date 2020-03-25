const server = require("../api/server.js");
const TestObject = require("./test-objects.js");
const request = require("supertest");
const db = require("../database/db-config.js");
const knexCleaner = require('knex-cleaner');
const auth = TestObject.auth;
const setCookie = TestObject.setCookie;
const promisedCookie = TestObject.promisedCookie;

var options = {
	mode: 'truncate',
	restartIdentity: true,
	ignoreTables: ['userBooks']
};

describe("user-genre-router", function() {
	beforeEach(async function() {
		await knexCleaner.clean(db, options)
		return auth("/api/auth/signup", 
			{
				fullName: "Seeder Apple",
				emailAddress: "seedemail",
				password: "seedpassword" 
			}).then(res => {
				return setCookie(res, "/api/genre", { genreName: "fiction", userId: 1 })
			});
	});

	describe("GET", function() {
		it("Get user from genre", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.get("/api/genre/1")
					.set("cookie", cookie)
					.expect(200)
				return req;
			});
		});
	});

	describe("PUT", function() {
		it("update genre for user", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.put("/api/genre/")
					.send({ genreName: "funny", userId: 1 })
					.set("cookie", cookie)
					.expect(201)
				return req;
			});
		});
	});

	describe("DELETE", function() {
		it("delete user genre", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.delete("/api/genre/1")
					.set("cookie", cookie)
					.expect(200)
				return req;
			});
		});
	});
});