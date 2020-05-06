const request = require("supertest");

const server = require("../api/server");
let token;

const getRandom = (max) => {
    return Math.floor(Math.random() * Math.floor(max))
}

describe("user-books-router.js", () => {
    
    beforeEach((done) => {
        return request(server)
            .post("/api/auth/signin")
            .send({ "emailAddress": "test", "password": "test" })
            .end((err, response) => {
                token = response.body.token;
                
                done();
            });
    });
    afterAll(async () => {
        await pg.end()
    })
describe("GET to /api/:userId/library", () => {
        it("returns 200 ok and an array of books", async () => {
            return request(server)
                .get("/api/2/library")
                .set({ authorization: `${ token }` })
                .then(response => {
                    expect(response.status).toBe(200);
                    expect(response.body.length).not.toBe(undefined);
                });
        });
    });
    
    describe("GET to /api/:userId/library/favorites", () => {
        it("returns 200 ok and an array of books with the favorite: true key/pair", async () => {
            return request(server)
                .get("/api/20/library/favorites")
                .set({ authorization: `${ token }` })
                .then(response => {
                    expect(response.status).toBe(200);
                    expect( response.body.map(book => book["favorite"])).not.toContain(false);
                });
            });
    });
    
    describe("GET to /:userId/library/:bookId", () => {
        it("returns 200 ok and a book", async () => {
            return request(server)
                .get("/api/2/library/1")
                .set({ authorization: `${ token }` })
                .then(response => {
                    expect(response.status).toBe(200);
                    expect(response.body["bookId"]).toBe(1);
                });
        });
    });
    
    describe("POST to /api/:userId/library", () => {
        
        it("returns 201 created and book", async () => {
            return request(server)
                .post("/api/20/library")
                .send({ 
                    "book": 
                        {
                        "id":  getRandom(9999),
                        "googleId": `${  getRandom(99999) }`,
                        "title": "test",
                        "authors": "test",
                        "publisher": "test",
                        "publishedDate": "2016",
                        "description": "test",
                        "isbn10": "227.115.188.152",
                        "isbn13": "25.182.133.118",
                        "pageCount": 36309,
                        "categories": "test",
                        "thumbnail": "http://lorempixel.com/640/480",
                        "smallThumbnail": "http://lorempixel.com/640/480",
                        "language": "english",
                        "webReaderLink": "http://emma.net",
                        "textSnippet": "Quas sint et qui cum similique et. Fuga voluptas aut et repellat architecto perspiciatis nemo. Enim quis velit possimus consequatur. Minima dolores quam expedita aperiam quia labore illo ab ullam. Dolores sed quas iure eligendi nisi molestiae est.",
                        "isEbook": false,
                        "averageRating": "3.00"
                        }, 
                    "readingStatus": 0,
                    "favorite": true,
                    "userRating": "3.50" 
                })
                .set({ authorization: `${ token }` })
                .then(response => {
                    expect(response.status).toBe(201);
                    expect(response.body["added"]["title"]).toBe("test");
                });
        });
    });
    
    describe("PUT to /api/:userId/library", () => {
        it("returns 201 created and a message", async () => {
            return request(server)
                .put("/api/20/library")
                .send({ "bookId": 2, "dateEnded": "04/26/2020" })
                .set({ authorization: `${ token }` })
                .then(response => {
                    expect(response.status).toBe(201);
                    expect(response.body.message).toBe("user book updated successfully");            
                });
        });
    });
    
    describe(" DELETE to /api/:userId/library", () => {
        it("returns 200 ok and a message", async () => {
            return request(server)
                .get("/api/20/library")
                .set({ authorization: token })
                .then(res => {
                    const last = res.body[0]["bookId"]
                    return request(server)
                        .delete("/api/20/library")
                        .send({ "bookId": last })
                        .set({ authorization: token })
                        .then(response => {
                            expect(response.status).toBe(200);
                            expect(response.body.message).toBe("book deleted from user library");            
                        });
                 });
        });                                
    });
});
