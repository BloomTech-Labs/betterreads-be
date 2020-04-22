const request = require("supertest");
const server = require("../api/server");

describe("auth-router.js", () => {
    
    // describe("POST /signup", () => {
    //     it("returns status 201, a token and a body with type json", async () => {
    //         const random = await Math.random();
    //         const response = await request(server).post("/api/auth/signup").send({ 
    //             "fullName": "testing with supertest", "emailAddress": `${ random }`, "password": "testing with supertest" 
    //         });
            
    //         expect(response.status).toBe(201);
    //         expect(response.body.token).not.toBe(undefined);
    //         expect(response.type).toMatch(/json/i);
    //     });
    // });

    // describe("POST /signin", () => {
    //     it("returns status 200 OK, a token, and body with type json", async () => {
    //         const response = await request(server).post("/api/auth/signin").send({
    //             "emailAddress": "test", "password": "test"
    //         });
    //         expect(response.status).toBe(200);
    //         expect(response.body.token).not.toBe(undefined);
    //         expect(response.type).toMatch(/json/i);
    //     });
    // });

    describe("GET /google", () => {
        it("returns status 302 found", async () => {
            const response = await request(server).get("/api/auth/google");
            
            expect(response.status).toBe(302);  
        });
    });

    describe("GET /google/redirect", () => {
        it("returns status 302 found", async () => {
            const response = await request(server).get("/api/auth/google/redirect");
            
            expect(response.status).toBe(302);
        });
    });

    describe("GET /facebook", () => {
        it("returns status 302 found", async () => {
            const response = await request(server).get("/api/auth/facebook");
            
            expect(response.status).toBe(302);
        });
    });

    describe("GET /facebook/redirect", () => {
        it("returns status 302 found", async () => {
            const response = await request(server).get("/api/auth/facebook/redirect");
            
            expect(response.status).toBe(302);
        });
    });
});