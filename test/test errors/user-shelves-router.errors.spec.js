const request = require("supertest");

const server = require("../../api/server");

describe("error testing for user-shelves-router.js", () => {
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
    
    describe("error testing for POST to /api/shelves/user/:userId", () => {
        it("returns 500 if the requested user does not exist", async () => {
            return request(server)
                .post("/api/shelves/user/999")
                .set({ authorization: token })
                .expect(500);
        });
        
        it("returns 500 if missing fields", async () => {
            return request(server)
                .post("/api/shelves/user/20")
                .set({ authorization: token })
                .send({ })
                .expect(500)
        });
    });
    
    describe("error testing for GET to /api/shelves/user/:userId", () => {
        it("returns 404 if requested user doens't exist", async () => {
            return request(server)
                .get("/api/shelves/user/9999")
                .set({ authorization: token })
                .expect(404);
        });
    });
    
    describe("error testing for GET to /api/shelves/:shelfId", () => {
        it("returns 404 if requested shelf does not exist", async () => {
            return request(server)
                .get("/api/sheves/999")
                .set({ authorization: token })
                .expect(404);
        });
    });
    
    describe("error testing PUT to /api/sheves/:shelfId", () => {
        it("returns 404 is requested shelf doesn't exist", async () => {
            return request(server)
                .put("/api/shelves/999")
                .set({ authorization: token })
                .send({ "shelfId": 1, "shelfName": "test", "isPriate": false })
                .expect(404);
        });
    });
    
    describe("error testing DELETE to /api/sheves/:shelfId", () => {
        it("returns 404 is requested shelf doesn't exist", async () => {
            return request(server)
                .delete("/api/shelves/999")
                .set({ authorization: token })
                .expect(404)
        });
    });
});