const request = require("supertest");

const server = require("../api/server");
const getToken = require("./getToken");

describe("user-books-router.js", () => {
    
    describe("GET to /api/:userId/library", () => {
        
        it("returns 200 ok and an array of books", async () => {
            const response = await request(server).get("/api/2/library")
                .set({ authorization: `${ await getToken() }` });
                
            expect(response.status).toBe(200);
            expect(response.body.length).not.toBe(undefined);
        });
    });
    
    describe("GET to /api/:userId/library/favorites", () => {
        
        it("returns 200 ok and an array of books with the favorite: true key/pair", async () => {
            const response = await request(server).get("/api/1/library/favorites")
                .set({ authorization: await getToken() });
                
            expect(response.status).toBe(200);
            expect(await response.body.map(book => book["favorite"])).not.toContain(false);
        });
    });
    
    describe("GET to /:userId/library/:bookId", () => {
        
        it("returns 200 ok and a book", async () => {
            const response = await request(server).get("/api/2/library/1")
                .set({ authorization: await getToken() });
            
            expect(response.status).toBe(200);
            expect(response.body["bookId"]).toBe(1);
        });
    });
    
    describe("PATCH to /api/:userId/library", () => {
        
        it("returns 201 created and a message", async () => {
            const response = await request(server).patch("/api/2/library")
            .send({ "bookId": 2, "dateEnded": "04/26/2020" })
            .set({ authorization: await getToken() });
            
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("user book updated successfully");            
        });
    });
    
    describe("POST to /api/:userId/library", () => {
        
        it("returns 201 created and book", async () => {
            const response = await request(server).post("/api/1/library")
                .send({ 
                    "book": 
                    {
                        "id": await Math.random().toFixed(0) * 100,
                        "googleId": `${ await Math.random().toFixed(4) }`,
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
                .set({ authorization: await getToken() });
            
            expect(response.status).toBe(201);
            expect(response.body["added"]["title"]).toBe("test");
        });
    });
    
    describe(" DELETE to /api/:userId/library", () => {
        
        it("returns 200 ok and a message", async () => {
            const res  = await request(server).get("/api/20/library")
                .set({ authorization: await getToken() });
                
            const last = res.body[0]["bookId"]
            const response = await request(server).delete("/api/20/library")
                .send({ "bookId": last })
                .set({ authorization: await getToken() });
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("book deleted from user library");            
            });
    });
});