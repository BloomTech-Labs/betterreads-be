const request = require("supertest");

const server = require("../../api/server");

describe("error testing for stats-router.js", () => {
    describe("error testing for GET to /api/stats/:userId", () => {
       it("returns 404 not found if requested user does not exist", async () => {
           return request(server)
            .get("/api/stats/999")
            .expect(404);
       })
    })
})