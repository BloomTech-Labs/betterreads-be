const request = require("supertest");

const server = require("../../api/server");
let token;

describe("error testing for book-tagging-router.js", () => {
    beforeEach(async () => {
        return request(server)
            .post("/api/auth/signin")
            .send({ "emailAddress": "test", "password": "test" })
            .then(response => {
                token = response.body.token;
            });
    });
    afterAll(async () => {
        await pg.end();
    });
    
    describe("error testing for POST to /api/tags/:userBooksId", () => {
        it("returns 400 bad request if the requested tag already exists on the requested book", async () => {
            return request(server)
                .post("/api/tags/1")
                .set({ authorization: token })
                .send({ "tags": "new tag" })
                .expect(400);
        });
        
        it("returns 404 not found if the requested book does not exist", async () => {
            return request(server)
                .get("/api/tags/999")
                .set({ authorization: token })
                .expect(404);
        });
        
        it("returns 400 bad request if no tag(s) is/are passed", async () => {
            return request(server)
                .post("/api/tags/1")
                .set({ authorization: token })
                .send({ })
                .expect(400);
        });
    });
    
    describe("error testing for GET to /api/tags/:userId", () => {
        it("returns 404 not found if the user ID is invalid", async () => {
            return request(server)
                .get("/api/tags/user/999")
                .set({ authorization: token })
                .expect(404)    
        });
        
        it("returns 404 not found if no tags exist for requested user", async () => {
            return request(server)
                .get("/api/tags/user/2")
                .set({ authorization: token })
                .expect(404);
        })
    });
    
    describe("error testing for PUT to /api/tags/:tagId", () => {
        it("returns 400 bad request if tag already exists on requested book", async () => {
            return request(server)
                .get("/api/tags/1")
                .set({ authorization: token })
                .then(res => {
                    let array = res.body["tags"];
                    let last = array[array.length - 1];
                    let tag = last["bookTagName"];
                    let tagId = last["tagId"];
                    return request(server)
                        .put(`/api/tags/${ tagId }`)
                        .set({ authorization: token })
                        .send({ "newTag": `${ tag }` })
                        .expect(400);
                });
        });
        
        it("returns 404 not found if requested tag does not exist", async () => {
            return request(server)
                .put("/api/tags/999")
                .set({ authorization: token })
                .send({ "newTag": "new tag" })
                .expect(404);
        });
    });
    
    describe("error testing for DELETE to /api/tags/:tagId", () => {
        it("returns 404 if the requested tag does not exist", async () => {
            return request(server)
                .delete("/api/tags/999")
                .set({ authorization: token })
                .expect(404);
        });
    });
});