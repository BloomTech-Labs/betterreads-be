const request = require("supertest");

const server = require("../api/server");
let token;
const rand = Math.random()
describe("testing for book-tagging-router.js", () => {
    beforeEach(async () => {
        return request(server)
            .post("/api/auth/signin")
            .send({ "emailAddress": "test", "password": "test" })
            .then(response => {
                token = response.body.token;
            });
    });
    afterAll = async () => {
        await pg.end();
    };
    
    describe("POST to /api/tags/:userBooksId", () => {
        it("returns 201 created and a message", async () => {
            return request(server)
                .post("/api/tags/1")
                .set({ authorization: token })
                .send({ "tags": `${ rand }` })
                .then(response => {
                    expect(response.status).toBe(201);
                    expect(response.body["message"]).toBe("tag(s) successfully added");
                });
        });
    });
    
    describe("GET to /api/tags/:userBooksId", () => {
        it("returns 200 ok and an array of tags", async () => {
            return request(server)
                .get("/api/tags/1")
                .set({ authorization: token })
                .then(response => {
                    expect(response.status).toBe(200);
                    expect(response.body["tags"].length).not.toBe(0);
                });
        });
    });
    
    describe("GET to /api/tags/user/:userId", () => {
        it("returns 200 ok and an array of books and tags", async () => {
            return request(server)
                .get("/api/tags/user/1")
                .set({ authorization: token })
                .then(response => {
                    expect(response.status).toBe(200);
                    expect(response.body["tags"].length).not.toBe(0);
                });
        });
    });
    
    describe("PUT to /api/tags/:tagId", () => {
        it("returns 201 created and a message", async () => {
            return request(server)
                .put("/api/tags/29")
                .set({ authorization: token })
                .send({ "newTag": `${ rand }` })
                .then(response => {
                    expect(response.status).toBe(201);
                    expect(response.body["message"]).toBe("tag updated successfully");
                });
        });
    });
    
    describe("DELETE to /api/tags/:tagId", () => {
        it("returns 200 ok and a message", async () => {
            return request(server)
                .get("/api/tags/user/1")
                .set({ authorization: token })
                .then(res => {
                    let array = res.body["tags"];
                    let last = array[array.length - 1]["tagId"];
                    return request(server)
                        .delete(`/api/tags/${ last }`)
                        .set({ authorization: token })
                        .then(response => {
                            expect(response.status).toBe(200);
                            expect(response.body["message"]).toBe("tag deleted");
                        });
                });
        });
    });
});