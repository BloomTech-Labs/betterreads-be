const request = require("supertest");

const server = require("../../api/server");

describe("error testing for recommendations-router.js", () => {
    beforeEach(async () => {
        return request(server)
            .post("/api/auth/signin")
            .send({ "emailAddress": "test", "password": "test" })
            .then(response => {
                token = response.body.token;
            });
    });
    afterAll(async () => {
        await pg.end();
    });
    
    describe("error testing for GET to /api/:userId/recommendations", () => {
        it("returns 404 if requested user doesn't exist", async () => {
            return request(server)
                .get("/api/999/recommendations")
                .set({ authorization: token })
                .then(response => expect(response.status).toBe(404));
        });
    });
   
    describe("error testing for POST to /api/:userId/recommendations", () => {
        it("returns 404 if requested user doesn't exist", async () => {
            return request(server)
                .post("/api/999/recommendaitons")
                .set({ authorization: token })
                .then(response => expect(response.status).toBe(404));
        });
        
        it("returns 404 if no books are sent", async () => {
            return request(server)
                .post("/api/recommendations/20")
                .set({ authorization: token })
                .send({ "books": [] })
                .then(response => expect(response.status).toBe(404))
        });
    });
});