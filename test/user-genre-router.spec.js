const request = require("supertest");

const server = require("../api/server");
let token;

describe("user-genre-router.js", () => {
    
    beforeEach((done) => {
        return request(server)
            .post("/api/auth/signin")
            .send({ "emailAddress": "test", "password": "test" })
            .end((err, response) => {
                token = response.body.token;
                console.log(err);
                done();
            });
    });
    describe("POST to /api/genre/", () => {
        it("returns 201 created and the created genre", async () => {
            const rand = Math.random().toFixed(3);
            return request(server)
                .post("/api/genre")
                .send({ "genreName": `test genre ${ rand }`, "userId": 20 })
                .set({ authorization: token })
                .then(response => {
                    expect(response.status).toBe(201);
                    expect(response.body.message).toBe("genre added successfully");
                })
                .catch(({ name, message, stack }) => console.log(name, message, stack));
        });
    });
    
    describe("GET to /api/genres/", () => {
        it("returns 200 ok, a message and an array of genres", async () => {
            return request(server)
                .get("/api/genre/1")
                .set({ authorization: `${ token }` })
                .then(response => {
                    expect(response.status).toBe(200);
                    expect(response.body).not.toHaveLength(0);                      
                })
                .catch(({ name, message, stack }) => console.log(name, message, stack));
        });
    });
    
    describe("PUT to /api/genre/:userId/:genreId/", () => {
        it("returns 201 created and a message", async () => {            
            return request(server)
                .get("/api/genre/20")
                .set({ authorization: token })
                .then(res => {
                    const genres = res.body 
                    const last = genres[genres.length - 1];
                    return request(server)
                        .put(`/api/genre/20/${ last.id }`)
                        .send({ "genreName": "test of put" })
                        .set({ authorization: `${ token }` })
                        .then(response => {
                            expect(response.status).toBe(201);
                            expect(response.body.message).toBe("genre updated successfully");
                        })
                        .catch(({ name, message, stack }) => console.log(name, message, stack));    
                })
                .catch(({ name, message, stack }) => console.log(name, message, stack));
        });
    });
    
    describe("DELETE to /api/genre/:userId/:genreId", () => {
        it("Returns 200 ok and a message", async () => {
            return request(server)
                .get("/api/genre/20")
                .set({ authorization: token })
                .then(res => {
                    const genres = res.body 
                    const last = genres[genres.length - 1];
                    return request(server)
                        .delete(`/api/genre/20/${ last.id }`)
                        .set({ authorization: token })
                        .then(response => {
                            expect(response.status).toBe(200);
                            expect(response.body.message).toBe("genre deleted successfully");    
                        })
                        .catch(({ name, message, stack }) => console.log(name, message, stack));
                })
                .catch(({ name, message, stack }) => console.log(name, message, stack));
        });
    });
});