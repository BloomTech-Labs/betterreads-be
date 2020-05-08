const request = require("supertest");

const server = require("../api/server");
let token;

describe("user-shelves-router.js", () => {
    
    beforeEach(async () => {
        return request(server)
            .post("/api/auth/signin")
            .send({ "emailAddress": "test", "password": "test" })
            .then(response => {
                token = response.body.token;
            });
    });
    afterAll(async () => {
        await pg.end()
    });
describe("POST /api/shelves/user/:userId", () => {
        it("returns 201 created and the created shelf", async () => {
            return request(server)
                .post("/api/shelves/user/1")
                .send({ "shelfName": "testing test test shelf", "isPrivate": false })
                .set({ authorization: token })
                .then(response => {
                    expect(response.status).toBe(201);
                    expect(response.body).not.toBe(undefined);
                    expect(response.body["shelfName"]).toBe("testing test test shelf");
                });
        });        
    });
    
    describe("GET to /user/:userId", () => {
        it("returns 200 ok and an array of shelves", async () => {
            return request(server)
                .get("/api/shelves/user/1")
                .set({ authorization: token })
                .then(response => {
                    const array = response.body;            
                    
                    expect(response.status).toBe(200);
                    expect(response.body).not.toBe(0); 
                    expect(array.map(shelf => shelf["shelfName"])).toContain("testing test test shelf");          
                });
        });
    });
    
    describe("GET to /api/shelves/:shelfId", () => {
        it("returns 200 ok and an array of books", async () => {
            return request(server)
                .get("/api/shelves/98")
                .set({ authorization: token })
                .then(response => {
                    expect(response.status).toBe(200);
                    expect(response.body.length).not.toBe(undefined);            
                });
        });
    });
    
    describe("DELETE to /api/shelves/:shelfId", () => {
       it("returns 200 ok and a message", async () => {
            return request(server).get("/api/shelves/user/1")
                .set({ authorization: token })
                .then(res => {
                    const last = res.body[res.body.length - 1]["shelfId"];
                    return request(server)
                        .delete(`/api/shelves/${ last }`)
                        .set({ authorization: token })
                        .then(response => {
                            expect(response.status).toBe(200);
                            expect(response.body.message).toBe("shelf deleted successfully");
                        });
                });
       }, 10000); 
    });
    
    describe("PUT to /api/shelves/:sheldId", () => {
        it("returns 201 created and a message", async () => {
            return request(server)
                .put("/api/shelves/98")
                .send({ "shelfName": "test of put", "isPrivate": false })
                .set({ authorization: token })
                .then(response => {
                    expect(response.status).toBe(201);
                    expect(response.body.message).toBe("updated successfully");            
                });
        });
    });
});