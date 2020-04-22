const request = require("supertest");

const server = require("../api/server");

const token = async () => {
    const response = await request(server).post("/api/auth/reset/requestreset")
        .send({ "email": `${ process.env.TEST_EMAIL }` });
        
    return(response.body.token);    
}
describe("POST to /api/auth/reset/requestreset", () => {
    it("returns 200 ok and a token", async () => {
        const response = await request(server).post("/api/auth/reset/requestreset")
            .send({ "email": `${ process.env.TEST_EMAIL }` });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Request received, a link has been sent to the requested email.")
        expect(response.body.token).not.toBe(undefined);
    });
});

describe("POST to /api/auth/reset", () => {
    it("returns 201 created and a message", async () => {
        const response = await request(server).post("/api/auth/reset/")
            .send({ token: `${ await token() }`, "password": "test password reset" });
        
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Successfully updated user info");
    })
})