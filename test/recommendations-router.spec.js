const request = require("supertest");

const server = require("../api/server");
const getToken = require("./getToken");

describe("GET to /api/:userId/recommendations", () => {
    it("returns 200 ok, a message and an array of google IDs", async () => {
        const response = await request(server).get("/api/1/recommendations")
            .set({ authorization: `${ await getToken() }` });
            
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("recommendations retrieved successfully");
        expect(response.body.recommendations).not.toBe(undefined);
        expect(Object.keys(response.body.recommendations.recommendations[0])[6]).toMatch("id");
        expect(response.body.recommendations).toHaveLength(5);
    });
});