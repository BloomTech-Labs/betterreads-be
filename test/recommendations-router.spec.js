const request = require("supertest");
const { fetchData } = require("../routers/recommendations-router");
const server = require("../api/server");
let token;

describe("recommendations-router.js", () => {
  beforeEach(async () => {
    return request(server)
      .post("/api/auth/signin")
      .send({
        emailAddress: "test",
        password: "test",
      })
      .then((response) => {
        token = response.body.token;
      });
  });
  afterAll(async () => {
    await pg.end();
  });

  //   describe("fetchData Fetches Shelves and Recommendations", () => {
  //     it("Returns recommendations && shelf for valid user", () => {
  //       fetchData(6).then((res) => {
  //         expect(res.status.toBe(200));
  //         expect(res.body.recommendations).not.toBe(undefined);
  //       });
  //     });
  //     it("Returns empty recommendations && shelf for invalid user", () => {
  //       fetchData(999).then((res) => {
  //         expect(res.status.toBe(200));
  //         expect(res.body.recommendations).toHaveLength(0);
  //       });
  //     });
  //   });

  describe("/recommendations Fetches Shelves and Recommendations", () => {
    it("Returns recommendations && shelf for valid user", () => {
      return request(server)
        .get("/api/recommendations")
        .set({ authorization: token })
        .then((response) => {
          expect(response.status).toBe(200);
        });
    });
    it("Returns empty recommendations && shelf for invalid user", () => {
      return request(server)
        .get("/api/recommendations")
        .set({ authorization: "token" })
        .then((response) => {
          expect(response.status).toBe(500);
        });
    });
  });

  describe("GET to /api/:userId/recommendations", () => {
    it("returns 200 ok, a message and an array of google IDs", async () => {
      return request(server)
        .get("/api/1/recommendations")
        .set({ authorization: token })
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body.message).toBe(
            "recommendations retrieved successfully"
          );
          expect(response.body.recommendations).not.toBe(undefined);
          const key = Object.keys(
            response.body.recommendations.recommendations[0]
          );
          expect(key[4]).toContain("googleId");
          expect(
            response.body["recommendations"]["recommendations"]
          ).toHaveLength(5);
        });
    }, 60000);
  });

  describe("POST to /api/:userId/recommendations", () => {
    it("returns 200 ok and an array of books", async () => {
      return request(server)
        .post("/api/20/recommendations")
        .set({ authorization: `${token}` })
        .send({
          books: [
            {
              userBooksId: 297,
              bookId: 2,
              googleId: "-12.4797",
              title: "Computer",
              authors: "Gabrielle",
              readingStatus: 0,
              favorite: false,
              categories: "Developer",
              thumbnail: "http://lorempixel.com/640/480",
              pageCount: 25415,
              dateStarted: null,
              dateEnded: null,
              dateAdded: "2020-04-28T17:34:08.718Z",
              userRating: "3.50",
            },
          ],
        })
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body["message"]).toBe(
            "recommendations retrieved successfully"
          );
          expect(
            response.body["recommendations"]["recommendations"]
          ).not.toHaveLength(0);
        });
    }, 60000);
  });
});
