const server = require("../api/server.js");
const request = require("supertest");
const TestObject = require("./test-objects.js")
const db = require("../database/db-config.js");

const knexCleaner = require('knex-cleaner');
const auth = TestObject.auth;
const promisedCookie = TestObject.promisedCookie;

var options = {
	mode: 'truncate',
	restartIdentity: true,
	ignoreTables: ['userBooks']
}


describe("auth-router", function() {
	beforeEach(async function() {
		await knexCleaner.clean(db, options)
		return auth("/api/auth/signup", 
			{
				fullName: "Seeder Apple",
				emailAddress: "seedemail",
				password: "seedpassword" 
			})
	});

	describe("test environment", function() {
		it("should be using test env", function() {
			expect(process.env.NODE_ENV).toBe("testing");
		});
	});

	describe("api/auth/signup", function() {
		it("succeeds and is a json object", function() {
			return auth("/api/auth/signup", 
				{ 
					fullName: "Person Lastname",
					emailAddress: "testemail3", 
					password: "testpassword" 
				})
				.then(res => {
					expect(res.body.user.emailAddress).toBe("testemail3");
			});
		});

		it("fails on signup", function() {
			return auth("/api/auth/signup",
				{
					fullName: "nada",
					password: "ok",
				})
				.then(res => {
					expect(res.body.message).toBe("error registering user");
				});
		});
	});

	describe("api/auth/signin", function() {
		it("POST signin success", function() {
			return auth("/api/auth/signin",
				{ 
					emailAddress: "seedemail", 
					password: "seedpassword" 
				})
				.then(res => {
					expect(res.body.message).toBe("successfully logged in");
				});
		});

		it("POST fake user", function() {
			return auth("/api/auth/signin",
				{ 
					emailAddress: "failseedemail", 
					password: "failseedpassword" 
				})
				.then(res => {
					expect(res.body.message).toBe("invalid credentials");
				});
		});

		it("POST return error", function() {
			return auth("/api/auth/signin",
				{})
				.then(res => {
					expect(res.status).toBe(500);
				});
		});
	});

	describe("api/auth/signout", function() {

		it("signout success", function () {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword"  })
			.then(cookie => {
				return request(server)
					.get("/api/auth/signout")
					.then(res => {
						expect(res.body.message).toBe("successfully signed out")
					});
			});
		});
	});
});
