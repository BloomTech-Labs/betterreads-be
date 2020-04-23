const request = require("supertest");

const server = require("../api/server");
const getToken = require("./getToken");

describe("user-genre-router.js", () => {
    
    describe("GET to /api/genres/", () => {
        it("returns 200 ok, a message and an array of genres", async () => {
            const response = await request(server).get("/api/genre/1")
            .set({ authorization: `${ await getToken() }` })
                
            expect(response.status).toBe(200);
            expect(response.body).not.toHaveLength(0);
            
        });
    });
    
    describe("POST to /api/genre/", () => {
        it("returns 201 created and the created genre", async () => {
            const rand = await Math.random().toFixed(3);
            const response = await request(server).post("/api/genre")
                .send({ "genreName": `test genre ${ rand }`, "userId": 1 })
                .set({ authorization: `${ await getToken() }` });
                
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("genre added successfully");
        });
    });
});