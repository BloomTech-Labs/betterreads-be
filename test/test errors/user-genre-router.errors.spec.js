const request = require("supertest");

const server = require("../../api/server");

describe("error testing for user-gernre-router.js", () => {
    beforeEach(async (done) => {
        return request(server)
            .post("/api/auth/signin")
            .send({ "emailAddress": "test", "password": "test" })
            .end((err, response) => {
                token = response.body.token;
                done();
            });
    });
    afterAll(async () => {
        await pg.end();
    });
    
    describe("error testing for GET to /api/genre/:userId", () => {
        it("returns 400 if requested user does not exist", async () => {
            return request(server)
                .get("/api/genre/9999")
                .set({ authorization: token })
                .expect(400);
        });
    });
    
    describe("error testing for POST to /api/genre/:userId", () => {
        it("returns 400 if requested user does not exist", async () => {
            return request(server)
                .post("/api/genre/")
                .set({ authorization: token })
                .send({ "userId": 9999, "genreName": "test" })
                .expect(400);
        });
    });

    describe("error testing for PUT to /api/genre/:userId", () => {
        it("returns 404 if requested user does not exist", async () => {
            return request(server)
                .put("/api/genre/999/1")
                .set({ authorization: token })
                .send({ "updatedGenreName": "test" })
                .expect(404);
        });
    });
    
    describe("error testing for DELETE to /api/genre/:userId", () => {
        it("returns 404 if requested user does not exist", async () => {
            return request(server)
                .delete("/api/genre/9999/1")
                .set({ authorization: token })
                .send({ "userId": 9999, "genreName": "test" })
                .expect(404);
        });
    });
    
});