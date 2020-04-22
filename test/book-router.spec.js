const request = require("supertest");

const server = require("../api/server");
const books = require("../models/books");
const getToken = require("./getToken");

const randomGoogleId = async () => {
    const num = await Math.random()
    const float = await num.toFixed(3);
    return float;
    
}

const randomTitle = async () => {
    const num = await Math.random()
    const float = await num.toFixed(5);
    return float;
    
}

const randomPageNum = async () => {
    const num = await Math.random();
    const float = await num.toFixed(0);
    return float;
}

describe("book-router.js", () => {
    
describe("GET to /api/books", () => {

        it("returns 200 ok and an array of books", async () => {
            
            const response = await request(server).get("/api/books").set({ authorization: `${ await getToken() }` });
            
            expect(response.body).not.toBe(undefined);
            expect(response.status).toBe(200);
            
        });
    });

    describe("GET to /api/books/:bookId", () => {
        it("returns status 200 and a single book", async () => {
            const response = await request(server).get("/api/books/1").set({ authorization: `${ await getToken() }` });
            
            expect(response.body).not.toBe(undefined);
            expect(response.body.id).not.toBe(undefined);
            expect(response.body.id).toBe(1);
        });
    });

    describe("POST to /api/books", () => {
        afterEach(async () => {
            await books.del({ authors: "test" });
        })
        it("returns status 201 and a message", async () => {
            const response = await request(server).post("/api/books").set({ authorization: `${ await getToken() }`})
                .send({ 
                    "googleId": `-99.${ await randomGoogleId() }`,
                    "title": `test${ await randomTitle() }`,
                    "authors": "test",
                    "publisher": "test",
                    "publishedDate": "test",
                    "description": "test",
                    "isbn10": "test",
                    "isbn13": "test",
                    "pageCount": await randomPageNum(),
                    "categories": "test",
                    "thumbnail": "test",
                    "smallThumbnail": "test",
                    "language": "test",
                    "webReaderLink": "test",
                    "textSnippet": "test",
                    "isEbook": false,
                    "averageRating": "3.00"
                });
            
                expect(response.body.message).toBe("Added book to our api");
                expect(response.status).toBe(201);
        });
    });
});
