const request = require("supertest");

const server = require("../../api/server");

describe("error testing for password-reset.js", () => {
    afterAll(async () => {
        await pg.end();
    });
    beforeEach((done) => {
        return request(server)
            .post("/api/auth/signin")
            .send({ "emailAddress": "test", "password": "test" })
            .end((err, response) => {
                token = response.body.token;
                done();
            });
    });
    
    describe("error testing for POST to /api/auth/requestreset", () => {
        it("returns 404 is the requested user does not exist", async () => {
            return request(server)
                .post("/api/auth/reset/requestreset")
                .send({ "email": "nonexistent email" })
                .then(response => expect(response.status).toBe(404));
        });
    });
    
    describe("error testing for POST to /api/auth/reset", () => {
        it("returns 500 if token is invalid", async () => {
            return request(server)
                .post("/api/auth/reset")
                .send({ "token": "invalid token", "password": "new password" })
                .then(response => expect(response.status).toBe(500))
        });
    });
});
