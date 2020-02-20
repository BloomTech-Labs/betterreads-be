const server = require("../api/server.js");
const request = require("supertest");

describe("server", function() {
  it("runs the tests", function() {
    expect(true).toBe(true);
  });

  describe("GET /", function() {
    it("should return 200 OK", function() {
      // make a GET request to /
      return request(server)
        .get("/")
        .then(res => {
          // check that the status code is 200
          expect(res.status).toBe(200);
        });
    });
  });

  describe("GET /", function() {
    it("should return JSON", function() {
      return request(server)
        .get("/")
        .then(res => {
          expect(res.body.api).toBe("up!");
        });
    });
  });
  describe("GET /", function() {
    it("toMatch JSON", function() {
      return request(server)
        .get("/")
        .then(res => {
          expect(res.type).toMatch(/JSON/i);
        });
    });
  });
});

