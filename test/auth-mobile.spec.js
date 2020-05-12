const request = require("supertest");

const server = require("../api/server");
const getRandom = () => Math.random() * 100000;
const random = getRandom();
describe("auth-mobile.js", () => {
  afterAll(async () => {
    await pg.end();
  });

  describe("POST /signup", () => {
    it("returns status 201, a token and a body with type json", async () => {
      return request(server)
        .post("/api/auth/mobile/signup")
        .send({
          fullName: "testing with supertest",
          emailAddress: `${random}`,
          password: "testing with supertest",
        })
        .then((response) => {
          expect(response.status).toBe(201);
          expect(response.body.token).not.toBe(undefined);
          expect(response.type).toMatch(/json/i);
        });
    });
  });

  describe("POST /signin", () => {
    it("returns status 200 OK, a token, and body with type json", async () => {
      return request(server)
        .post("/api/auth/mobile/signin")
        .send({
          emailAddress: "testingdev@testingdev.com",
          password: "testingdev@testingdev.com",
        })
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body.token).not.toBe(undefined);
          expect(response.type).toMatch(/json/i);
        });
    });
  });
});
