const request = require("supertest");

const server = require("../api/server");
const books = require("../models/books");

const randomGoogleId =  () => {
    const num =  Math.random()
    const float =  num.toFixed(3);
    return float;
    
}

const randomTitle =  () => {
    const num =  Math.random()
    const float =  num.toFixed(5);
    return float;
    
}

const randomPageNum =  () => {
    const num =  Math.random();
    const float =  num.toFixed(0);
    return float;
}
let token;

describe("book-router.js", () => {
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
describe("GET to /api/books", () => {
        it("returns 200 ok and an array of books", async () => {
            return request(server)
                .get("/api/books")
                .set({ authorization: token })
                .then(response => {
                    expect(response.body).not.toBe(undefined);
                    expect(response.status).toBe(200);
                })
                .catch(({ name, message, stack }) => console.log(name, message, stack));
        });
    });

    describe("GET to /api/books/:bookId", () => {
        it("returns status 200 and a single book", async () => {
            return request(server)
                .get("/api/books/1")
                .set({ authorization: token })
                .then(response => {
                    expect(response.body).not.toBe(undefined);
                    expect(response.body.id).not.toBe(undefined);
                    expect(response.body.id).toBe(1);
                })
                .catch(({ name, message, stack }) => console.log(name, message, stack));
        });
    });

    describe("POST to /api/books", () => {
        afterEach( () => {
             books.del({ authors: "test" });
        })
        it("returns status 201 and a message", async () => {
            return request(server)
                .post("/api/books")
                .set({ authorization: token })
                .send({ 
                    "googleId": `-99.${  randomGoogleId() }`,
                    "title": `test${  randomTitle() }`,
                    "authors": "test",
                    "publisher": "test",
                    "publishedDate": "test",
                    "description": "test",
                    "isbn10": "test",
                    "isbn13": "test",
                    "pageCount":  randomPageNum(),
                    "categories": "test",
                    "thumbnail": "test",
                    "smallThumbnail": "test",
                    "language": "test",
                    "webReaderLink": "test",
                    "textSnippet": "test",
                    "isEbook": false,
                    "averageRating": "3.00"
                })
                .then(response => {
                    expect(response.body.message).toBe("Added book to our api");
                    expect(response.status).toBe(201);
                })
                .catch(({ name, message, stack }) => console.log(name, message, stack));
        });
    });
});
