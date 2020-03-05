const server = require("../api/server.js");
const request = require("supertest");
const db = require("../database/db-config.js");

const knexCleaner = require('knex-cleaner');

var options = {
	mode: 'truncate',
	restartIdentity: true,
	ignoreTables: ['userBooks']
}


describe("auth-router", function() {
	beforeEach(async function() {
		await knexCleaner.clean(db, options)
		return request(server)
			.post("/api/auth/signup")
			.send({
				fullName: "Seeder Apple",
				emailAddress: "seedemail",
				password: "seedpassword"
			});
	});

	describe("test environment", function() {
		it("should be using test env", function() {
			expect(process.env.NODE_ENV).toBe("testing");
		});
	});

	describe("api/auth/signup", function() {
		it("register", function() {
			return request(server)
				.post("/api/auth/signup")
				.send({
					fullName: "Judith Lastname",
					emailAddress: "testemail",
					password: "testpassword"
				})
				.expect(201);
		});

		it("is a json object", function() {
			return request(server)
				.post("/api/auth/signup")
				.send({ 
					fullName: "Person Lastname",
					emailAddress: "testemail3", 
					password: "testpassword" 
				})
				.then(res => {
					expect(res.body.user.emailAddress).toBe("testemail3");
				});
		});
	});

	describe("api/auth/login", function() {
		it("login", function() {
			return request(server)
				.post("/api/auth/signin")
				.send({
					emailAddress: "seedemail",
					password: "seedpassword"
				})
				.expect(200);
		});

		it("is a json object", function() {
			return request(server)
				.post("/api/auth/signin")
				.send({ 
					emailAddress: "seedemail", 
					password: "seedpassword" 
				})
				.then(res => {
					expect(res.body.message).toBe("successfully logged in");
				});
		});

		it("expect user", function() {
			return request(server)
				.post("/api/auth/signin")
				.send({ emailAddress: "failseedemail", password: "failseedpassword" })
				.then(res => {
					expect(res.body.message).toBe("invalid credentials");
				});
		});
	});
});
