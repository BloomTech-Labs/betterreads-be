const request = require("supertest");

const server = require("../api/server");
let token;

describe("user-books-on-a-shelf-router.js", () => {
    
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
    })
describe("POST to /api/booksonshelf/shelves/:shelfId", () => {
        it("returns 201 created and the added book", async () => {
            return request(server).post("/api/booksonshelf/shelves/46")
                .set({ authorization: `${ token }` })
                .send({
                    "book": 
                    {
                        "id": 1,
                        "googleId": "kGW8cops3GcC",
                        "title": "Why Civil Resistance Works",
                        "authors": "Erica Chenoweth,Maria J. Stephan,Maria J.. Stephan",
                        "publisher": "Columbia University Press",
                        "publishedDate": "2011",
                        "description": "For more than a century, from 1900 to 2006, campaigns of nonviolent resistance were more than twice as effective as their violent counterparts in achieving their stated goals. By attracting impressive support from citizens, whose activism takes the form of protests, boycotts, civil disobedience, and other forms of nonviolent noncooperation, these efforts help separate regimes from their main sources of power and produce remarkable results, even in Iran, Burma, the Philippines, and the Palestinian Territories. Combining statistical analysis with case studies of specific countries and territories, Erica Chenoweth and Maria J. Stephan detail the factors enabling such campaigns to succeed and, sometimes, causing them to fail. They find that nonviolent resistance presents fewer obstacles to moral and physical involvement and commitment, and that higher levels of participation contribute to enhanced resilience, greater opportunities for tactical innovation and civic disruption (and therefore less incentive for a regime to maintain its status quo), and shifts in loyalty among opponents' erstwhile supporters, including members of the military establishment. Chenoweth and Stephan conclude that successful nonviolent resistance ushers in more durable and internally peaceful democracies, which are less likely to regress into civil war. Presenting a rich, evidentiary argument, they originally and systematically compare violent and nonviolent outcomes in different historical periods and geographical contexts, debunking the myth that violence occurs because of structural and environmental factors and that it is necessary to achieve certain political goals. Instead, the authors discover, violent insurgency is rarely justifiable on strategic grounds.",
                        "isbn10": "0231156820",
                        "isbn13": "9780231156820",
                        "pageCount": 296,
                        "categories": "{\"Political Science\"}",
                        "thumbnail": "https://books.google.com/books/content?id=kGW8cops3GcC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
                        "smallThumbnail": "https://books.google.com/books/content?id=kGW8cops3GcC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
                        "language": "en",
                        "webReaderLink": "http://play.google.com/books/reader?id=kGW8cops3GcC&hl=&printsec=frontcover&source=gbs_api",
                        "textSnippet": "Combining statistical analysis with case studies of specific countries and territories, Erica Chenoweth and Maria J. Stephan detail the factors enabling such campaigns to succeed and, sometimes, causing them to fail.",
                        "isEbook": null,
                        "averageRating": "5.00"
                    }
                })
                .then(response => {
                    expect(response.status).toBe(201);
                    expect(response.body["book"]["bookId"]).toBe(1);
                })
        });
        
        describe("PUT to /api/booksonshelf/shelves/:shelfId", () => {
            it("returns 200 ok and an updated shelf ID", async () => {
                return request(server)
                    .put("/api/booksonshelf/shelves/46")
                    .set({ authorization: `${ token }` })
                    .send({ "bookId": 3, "newShelfId": 45 })
                    .then(response => {
                        expect(response.body["newShelfId"]).toBe(45) 
                        return request(server)
                            .put("/api/booksonshelf/shelves/45")
                            .set({ authorization: `${ token }` })
                            .send({ "bookId": 3, "newShelfId": 46 })
                            .then(res => {
                                expect(res.status).toBe(200);
                                expect(res.body["message"]).toBe("book moved to new shelf");
                                expect(res.body["newShelfId"]).toBe(46)   
                            });
                    });                   
            });
        });
        
        describe("GET to /api/booksonshelf/shelves/:shelfId", () => {
            it("returns 200 ok and a shelf and all books on it", async () => {
                return request(server)
                    .get("/api/booksonshelf/shelves/46")
                    .set({ authorization: `${ token }` })
                    .then(response => {
                        expect(response.status).toBe(200);
                        expect(response.body).not.toBe(undefined);
                        expect(response.body).not.toHaveLength(0);
                    });
            });
        });
        
        describe("GET to /api/booksonshelf/user/:userId/shelves/allbooks", () => {
            it("returns 200 ok and a list of shelves with books on them", async () => {
                return request(server)
                    .get("/api/booksonshelf/user/1/shelves/allbooks")
                    .set({ authorization: `${ token }` })
                    .then(response => {
                        expect(response.status).toBe(200);
                        expect(response.body).not.toBe(undefined);
                    });
            });
        });
        
        describe("DELETE to /api/booksonshelf/shelves/:shelfId/:bookId", () => {
            it("returns 200 ok and a message", async () => {
                return request(server)
                    .delete("/api/booksonshelf/shelves/46/1")
                    .set({ authorization: `${ token }` })
                    .then(response => {
                        expect(response.status).toBe(200);
                        expect(response.body["message"]).toBe("book removed from shelf")  
                    });
            });
        });
    });
});