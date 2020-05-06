const request = require("supertest");

const server = require("../api/server");
const getRandom = () =>  Math.random() * 100000;
const random = getRandom()
describe("auth-router.js", () => {
    afterAll(async () => {
        await pg.end()
    })
    describe("POST /signup", () => {
        it("returns status 201, a token and a body with type json", async () => {
            return request(server)
                .post("/api/auth/signup")
                .send({ 
                    "fullName": "testing with supertest", 
                    "emailAddress": `${ random }`, 
                    "password": "testing with supertest" 
                })
                .then(response => {
                    expect(response.status).toBe(201);
                    expect(response.body.token).not.toBe(undefined);
                    expect(response.type).toMatch(/json/i);
                });
        });
    });

    describe("POST /signin", () => {
        it("returns status 200 OK, a token, and body with type json", async () => {
            return request(server)
                .post("/api/auth/signin")
                .send({
                    "emailAddress": "test", 
                    "password": "test"
                })
                .then(response => {
                    expect(response.status).toBe(200);
                    expect(response.body.token).not.toBe(undefined);
                    expect(response.type).toMatch(/json/i);
                })
        });
    });

    describe("GET /google", () => {
        it("returns status 302 found", async () => {
            return request(server)
                .get("/api/auth/google")
                .then(response => expect(response.status).toBe(302))
        });
    });

    describe("GET /google/redirect", () => {
        it("returns status 302 found", async () => {
            return request(server)
                .get("/api/auth/google/redirect")
                .then(response => expect(response.status).toBe(302))
        });
    });

    describe("GET /facebook", () => {
        it("returns status 302 found", async () => {
            return request(server)
                .get("/api/auth/facebook")
                .then(response => expect(response.status).toBe(302))
        });
    });

    describe("GET /facebook/redirect", () => {
        it("returns status 302 found", async () => {
            return request(server)
                .get("/api/auth/facebook/redirect")
                .then(response => expect(response.status).toBe(302))
        });
    });
});