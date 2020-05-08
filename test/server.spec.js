const request = require("supertest");
const server = require("../api/server");

describe("server.js", () => {
    describe("GET /", () => {
        it ("returns 200 OK", async () => {
            return request(server).get("/")
              .then(response => expect(response.status).toBe(200))
        });
        it("returns json", async () => {
            return request(server).get("/")
                .then(response => expect(response.type).toMatch(/json/i))
        });
    });  
});

