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

	describe("GET for data science", function() {
		it("should return 200", function() {
			return request(server)
				.get("/api/ds/1")
				.then(res => {
					expect(res.status).toBe(200);
				});
		});

		it("return 500", function() {
			return request(server)
				.get("/api/dstotal")
				.then(res => {
					expect(res.status).toBe(200)
				})
		})
	})
});
