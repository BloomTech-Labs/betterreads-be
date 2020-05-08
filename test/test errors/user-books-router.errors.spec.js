const request = require("supertest");

const server = require("../../api/server");


describe("errors for user-book-router.js", () => {
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
    
    describe("GET to /api/:userId/library", () => {
        it("returns 404 if requested user does not exist", async () => {
            return request(server)
                .get("/api/999/library")
                .set({ authorization: `${ token }` })
                .expect(404);
        });
    });
    
    describe("error testing for GET to /api/:userId/library/:bookId", () => {
        it("returns 404 if the requested user does not exist", async () => {
            return request(server)
                .get("/api/userbooks/999/1")
                .set({ authorization: token })
                .expect(404);
        });
        
        it("returns 404 if the requested book does not exist", async () => {
            return request(server)
                .get("/api/userbooks/20/9999")
                .set({ authorization: token })
                .expect(404);
        });
    });
    describe("error testing for PUT to /api/:userId/library", () => {
        it("returns 404 if the requested user does not exist", async () => {
            return request(server)
                .put("/api/userbooks/1/library")
                .send({  })
                .set({ authorization: token })
                .expect(404);
        });
    });
    
    describe("error testing for DELETE to /api/:userId/library", () => {
        it("returns 404 if the requested user does not exist", async () => {
            return request(server)
                .delete("/api/userbooks/1/library/1")
                .send({ "bookId": 1 })
                .set({ authorization: token })
                .expect(404);
        });
    });
    
    describe("error testing for POST to /api/:userId/library", () => {
        it("returns 500 if the requested user does not exist", async () => {
            return request(server)
                .post("/api/9999/library/")
                .send({ "book": {
                    "id": 200,
                    "googleId": "2.4797",
                    "isbn10": "21.167.47.167",
                    "isbn13": "17.82.125.227",
                    "title": "Computer",
                    "authors": "Gabrielle",
                    "categories": "Developer",
                    "thumbnail": "http://lorempixel.com/640/480",
                    "pageCount": 25415,
                    "publisher": "Auer, Spinka and Hammes",
                    "publishedDate": "1919",
                    "description": "Non minima iste tempora fugiat impedit minus. Unde recusandae ut natus aliquam ab laboriosam vel.",
                    "textSnippet": "Corrupti qui magnam culpa.\nMinima beatae alias ipsam consequatur quaerat magni officiis ea ut.\nTempora quo est ratione fuga voluptas officiis numquam.\nMollitia id est reiciendis similique molestiae.\nNon quibusdam esse voluptas consequatur et nesciunt.",
                    "language": "english",
                    "webReaderLink": "https://raquel.info",
                    "isEbook": false,
                    "averageRating": "3.00"
                },
                    "readingStatus": 0,
                    "favorite": false,
                    "userRating": "3.50"
                })
                .set({ authorization: token })
                .expect(500);
        });
        
        it("returns 500 if missing fields", async () => {
            return request(server)
                .post("/api/1/library/")
                .send({ "book": { } })
                .set({ authorization: token })
                .expect(500);
        });
    });
});