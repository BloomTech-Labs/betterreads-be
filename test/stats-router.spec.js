const request =  require("supertest");

const server = require("../api/server");

describe("stats-router.js", () => {
    describe("GET to /api/stats", () => {
        it("returns 200 ok, a message and user-wide reading stats", async () => {
            return request(server)
                .get("/api/stats")
                .then(response => {
                    expect(response.status).toBe(200);
                    expect(response.body.message).toBe("user-wide stats retrieved")
                    expect(response.body["toBeRead"]).not.toBe(undefined)
                    expect(response.body["inProgress"]).not.toBe(undefined)
                    expect(response.body["completed"]).not.toBe(undefined)
                });
        });
    });
    
    describe("GET to /api/stats/:userId", () => {
        it("returns 200 ok, a message and user-wide reading stats", async () => {
            return request(server)
                .get("/api/stats/1")
                .then(response => {
                    expect(response.status).toBe(200);
                    expect(response.body.message).toBe("stats for the requested user retrieved")
                    expect(response.body["toBeRead"]).not.toBe(undefined)
                    expect(response.body["inProgress"]).not.toBe(undefined)
                    expect(response.body["completed"]).not.toBe(undefined)
                });
        });
    });
});