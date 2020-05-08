const request = require("supertest");

const server = require("../../api/server");

describe("error testing for user-books-on-a-shelf-router.js", () => {
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
    
    describe("error testing for POST to /api/booksonshelf/shelves/:shelfId", () => {
        it("returns 404 if requested shelf doesn't exist", async () => {
            return request(server)
                .post("/api/booksonshelf/shelves/9999/")
                .set({ authorization: token })
                .send({ "book":  
                    {
                        "id": 2,
                        "googleId": "-12.4797",
                        "title": "Computer",
                        "authors": "Gabrielle",
                        "publisher": "Auer, Spinka and Hammes",
                        "publishedDate": "1919",
                        "description": "Non minima iste tempora fugiat impedit minus. Unde recusandae ut natus aliquam ab laboriosam vel.",
                        "isbn10": "21.167.47.167",
                        "isbn13": "17.82.125.227",
                        "pageCount": 25415,
                        "categories": "Developer",
                        "thumbnail": "http://lorempixel.com/640/480",
                        "smallThumbnail": "http://lorempixel.com/640/480",
                        "language": "english",
                        "webReaderLink": "https://raquel.info",
                        "textSnippet": "Corrupti qui magnam culpa.\nMinima beatae alias ipsam consequatur quaerat magni officiis ea ut.\nTempora quo est ratione fuga voluptas officiis numquam.\nMollitia id est reiciendis similique molestiae.\nNon quibusdam esse voluptas consequatur et nesciunt.",
                        "isEbook": false,
                        "averageRating": "3.00"
                    },
                    	"readingStatus": 0,
                    	"favorite": false,
                    	"userRating": "3.50"
                    })
                    .then(response => expect(response.status).toBe(404))
        });
        
        it("returns 404 if no book is requested", async () => {
            return request(server)
                .post("/api/booksonshelf/shelves/1/")
                .set({ authorization: token })
                .send({ "book": { } }) 
                 .then(response => expect(response.status).toBe(404))
        });
        
        it("returns 404 if missing fields", async () => {
            return request(server)
                .post("/api/booksonshelf/shelves/1/")
                .set({ authorization: token })
                .send({ "book":  
                    {
                        "id": 2,
                        "title": "Computer",
                        "authors": "Gabrielle",
                        "publisher": "Auer, Spinka and Hammes",
                        "publishedDate": "1919",
                        "description": "Non minima iste tempora fugiat impedit minus. Unde recusandae ut natus aliquam ab laboriosam vel.",
                        "isbn10": "21.167.47.167",
                        "isbn13": "17.82.125.227",
                        "pageCount": 25415,
                        "categories": "Developer",
                        "thumbnail": "http://lorempixel.com/640/480",
                        "smallThumbnail": "http://lorempixel.com/640/480",
                        "language": "english",
                        "webReaderLink": "https://raquel.info",
                        "textSnippet": "Corrupti qui magnam culpa.\nMinima beatae alias ipsam consequatur quaerat magni officiis ea ut.\nTempora quo est ratione fuga voluptas officiis numquam.\nMollitia id est reiciendis similique molestiae.\nNon quibusdam esse voluptas consequatur et nesciunt.",
                        "isEbook": false,
                        "averageRating": "3.00"
                    },
                    	"readingStatus": 0,
                    	"favorite": false,
                    	"userRating": "3.50"
                })
                .then(response => expect(response.status).toBe(404))
        });
    });
    
    describe("error testing for DELETE to /api/booksonshelf/shelves/:shelfId/:bookId", () => {
        it("returns 404 if requested book doesn't exist", async () => {
            return request(server)
                .delete("/api/booksonshelf/1/9999")
                .set({ authorization: token })
                .expect(404);
        });
    });
    
    describe("error testing for PUT to /api/booksonshelf/:shelfId/:bookId", () => {
        it("returns 404 if requested book does not exist", async () => {
            return request(server)
                .put("/api/booksonshelf/1/9999")
                .set({ authorization: token })
                .expect(404);
        });
    });
    
    describe("error testing for get to /api/booksonshelf/shelves/:shelfId", () => {
        it("returns 404 if requested book doesn't exist", async () => {
            return request(server)
                .get("/api/booksonshelf/9999")
                .set({ authorization: token })
                .expect(404);
        });
    });
});