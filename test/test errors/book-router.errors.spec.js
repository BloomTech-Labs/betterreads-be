const request = require("supertest");

const server = require("../../api/server");

describe("error testing for book-router.js", () => {
    beforeEach(async (done) => {
        return request(server)
            .post("/api/auth/signin")
            .send({ "emailAddress": "test", "password": "test" })
            .end((err, response) => {
                token = response.body.token;
                done();
            });
    });
    afterAll(async () => {
        await pg.end();
    });
    
    describe("error testing for GET to /api/books/:bookId", () => {
        it("returns 404 if book doesn't exist", async () => {
            return request(server)
                .get("/api/books/1000")
                .set({ authorization: token })                
                .then(response => expect(response.status).toBe(404))
        });
    });
    
    describe("error testing for POST to /api/books", () => {
        it("returns 400 if the requested book already exists", async () => {
            return request(server)
                .post("/api/books")
                .set({ authorization: token })
                .send({
                    "id": 1,
                    "googleId": "-67.0365",
                    "title": "Bacon",
                    "authors": "Bud",
                    "publisher": "Franecki, Runte and Schmidt",
                    "publishedDate": "1910",
                    "description": "Autem nisi quis rem. Ea in aspernatur alias esse qui sit. Voluptate illo veritatis. Laboriosam deserunt laudantium. Et incidunt voluptatem. Repudiandae maxime at voluptas voluptatem dolores qui aperiam libero.",
                    "isbn10": "110.90.13.51",
                    "isbn13": "135.209.82.237",
                    "pageCount": 52560,
                    "categories": "Technician",
                    "thumbnail": "http://lorempixel.com/640/480",
                    "smallThumbnail": "http://lorempixel.com/640/480",
                    "language": "english",
                    "webReaderLink": "http://jermain.org",
                    "textSnippet": "Quia et aut assumenda iste perferendis recusandae sit nobis. Tempora ut ipsam.",
                    "isEbook": false,
                    "averageRating": "3.00"
                })
                .then(response => expect(response.status).toBe(400));
        });
        
        it("returns 400 if the request book is missing any fields", async () => {
            return request(server)
                .post("/api/books")
                .set({ authorization: token })
                .send({
                    "id": 1,
                    "googleId": "-67.0365",
                    "authors": "Bud",
                    "publisher": "Franecki, Runte and Schmidt",
                    "publishedDate": "1910",
                    "description": "Autem nisi quis rem. Ea in aspernatur alias esse qui sit. Voluptate illo veritatis. Laboriosam deserunt laudantium. Et incidunt voluptatem. Repudiandae maxime at voluptas voluptatem dolores qui aperiam libero.",
                    "isbn10": "110.90.13.51",
                    "isbn13": "135.209.82.237",
                    "pageCount": 52560,
                    "categories": "Technician",
                    "thumbnail": "http://lorempixel.com/640/480",
                    "smallThumbnail": "http://lorempixel.com/640/480",
                    "language": "english",
                    "webReaderLink": "http://jermain.org",
                    "textSnippet": "Quia et aut assumenda iste perferendis recusandae sit nobis. Tempora ut ipsam.",
                    "isEbook": false,
                    "averageRating": "3.00"
                })
                .then(response => expect(response.status).toBe(400));
        });
        
    });
});
