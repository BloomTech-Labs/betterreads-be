const request = require("supertest");

const server = require("../api/server");
const getToken = require("./getToken");

describe("user-genre-router.js", () => {
    
    describe("POST to /api/genre/", () => {
        it("returns 201 created and the created genre", async () => {
            const rand = await Math.random().toFixed(3);
            const response = await request(server).post("/api/genre")
            .send({ "genreName": `test genre ${ rand }`, "userId": 20 })
            .set({ authorization: await getToken() });
            
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("genre added successfully");
        });
    });
    
    describe("GET to /api/genres/", () => {
        it("returns 200 ok, a message and an array of genres", async () => {
            const response = await request(server).get("/api/genre/1")
            .set({ authorization: `${ await getToken() }` })
                
            expect(response.status).toBe(200);
            expect(response.body).not.toHaveLength(0);  
        });
    });
    
    describe("PUT to /api/genre/:userId/:genreId/", () => {
        it("returns 201 created and a message", async () => {            
            const res = await request(server).get("/api/genre/20").set({ authorization: await getToken() });
            const genres = res.body 
            const last = genres[genres.length - 1];
            const response = await request(server).put(`/api/genre/20/${ last.id }`)
                .send({ "genreName": "test of put" })
                .set({ authorization: `${ await getToken() }` });
                
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("genre updated successfully");
        });
    });
    
    describe("DELETE to /api/genre/:userId/:genreId", () => {
        it("Returns 200 ok and a message", async () => {
            const res = await request(server).get("/api/genre/20")
                .set({ authorization: await getToken() });
            const genres = res.body 
            const last = genres[genres.length - 1];
            const response = await request(server).delete(`/api/genre/20/${ last.id }`)
                .set({ authorization: await getToken() });
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("genre deleted successfully");    
        });
    });
});