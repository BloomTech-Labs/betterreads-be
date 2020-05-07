const request = require("supertest");

const server = require("../api/server");

describe("password-reset.js", () => {
    
    describe("POST to /api/auth/reset/requestreset", () => {
        it("returns 200 ok and a token", async () => {
            const response = await request(server).post("/api/auth/reset/requestreset")
                .send({ "email": `${ process.env.TEST_EMAIL }` });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Request recieved, a link has been sent to the requested email.")
        });
    });

// Cannot test /reset endpoint anymore as /requestreset does not return a token
});