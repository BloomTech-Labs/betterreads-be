const request = require("supertest");

const server = require("../api/server");
let token;
    describe("password-reset.js", () => {
        afterAll(async () => {
            await pg.end()
        })

    describe("POST to /api/auth/reset/requestreset", () => {
        it("returns 200 ok and a token", async () => {
            return request(server)
                .post("/api/auth/reset/requestreset")
                .send({ "email": `${ process.env.TEST_EMAIL }` })
                .then(response => {
                    expect(response.status).toBe(200);
                    expect(response.body.message).toBe("Request received, a link has been sent to the requested email.")
                })
        });
    });

//cannot test /reset endpoint, as /requestreset endpoint does not return a token (that wouldn't be secure).
 });
