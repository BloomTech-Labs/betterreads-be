const request = require("supertest");
const server = require("../api/server");

describe("server.js", () => {
  describe("GET /", () => {
      it ("returns 200 OK", async () => {
          const response = await request(server).get("/");
          
          expect(response.status).toBe(200);
      });
      it("returns json", async () => {
          const response = await request(server).get("/");
          
          expect(response.type).toMatch(/json/i);
      })
  });  
});

