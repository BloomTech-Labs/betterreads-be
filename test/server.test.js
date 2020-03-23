const server = require("../api/server.js");
const request = require("supertest");

describe("server", function() {
	
	it("runs the tests", function() {
		expect(true).toBe(true);
	});

	describe("GET /", function() {
		it("should return JSON", function() {
			return request(server)
				.get("/")
				.then(res => {
					expect(res.body.message).toBe("server is working");
				});
		});
	});
});
