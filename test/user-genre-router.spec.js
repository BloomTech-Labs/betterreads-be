const request = require("supertest");

const server = require("../api/server");
const getToken = require("./getToken");

describe("user-genre-router.js", () => {
    
    describe("GET to /api/genres/:userId", () => {
        it("returns 200 ok, amessage and an array of genres", async () => {
            const response = await request(server).get("/api/genres/1")
                .set({ authorization: `${ await getToken() }` });
                
            expect(response.status).toBe(200);
            
        })
    })
})