const server = require("../api/server.js");
const request = require("supertest");
const db = require("../database/db-config.js");

const knexCleaner = require('knex-cleaner');

var options = {
	mode: 'truncate',
	restartIdentity: true,
    ignoreTables: ['userShelves', 'userBooks', 'userBooksOnAShelf']
    
};

describe("user-books-on-a-shelf", function() {
	
const body = {
    book: {
            googleId: "8888ATEATE",
            title: "Don't Trust A Bank",
            authors: "Edd Stark",
            publisher: "Ice&Fire",
            publishedDate: "2/21/2020",
            description: "Something or another",
            isbn10: "12345678911234567891",
            isbn13: "12345678911234567891234",
            pageCount: 210,
            categories: "swenad",
            thumbnail: "image.png",
            smallThumbnail: "small-img.png",
            language: "english",
            webReaderLink: "testLink",
            textSnippet: "testSnippet",
            isEbook: true,
            averageRating: 5
        },
        readingStatus: 1,
        favorite: true
    }

    const bookObject2 = {
            googleId: "999NINNER",
            title: "In those genes",
            authors: "Emmit Smith",
            publisher: "Austin Co.",
            publishedDate: "8/2/1980",
            description: "The birth of dirt",
            isbn10: "12345678911234567891",
            isbn13: "12345678911234567891234",
            pageCount: 210,
            categories: "swenad",
            thumbnail: "image.png",
            smallThumbnail: "small-img.png",
            language: "english",
            webReaderLink: "testLink",
            textSnippet: "testSnippet",
            isEbook: true,
            averageRating: 4
        };
        const shelfObj = {
            shelfName: "Test shelf",
            isPrivate: false
        }

        const bookObj = {
            bookId: 1,
            shelfId: 1
          }

	// MARK: -- helper function to grab cookie
	function promisedCookie(user) {
		return new Promise((resolve, reject) => {
			request(server)
			.post("/api/auth/signin")
			.send(user)
			.end(function(err, res) {
				if (err) { throw err; }
				let signinCookie = res.headers["set-cookie"];
				resolve(signinCookie);
			});
		});
	}

	beforeAll(async function() {
		await knexCleaner.clean(db, options)
		return request(server)
			.post("/api/auth/signup")
			.send({
				fullName: "Seeder Apple",
				emailAddress: "seedemail",
				password: "seedpassword"
			}).then(res => {
				const cookie = res.headers["set-cookie"]
				return request(server)
					.post("/api/books")
					.send(bookObject2)
					.set("cookie", cookie)
					.then(res => {
						return request(server)
							.post('/api/1/library')
							.send({ book: bookObject2, readingStatus: 2 })
                            .set("cookie", cookie)
                            .then(res => {
                                return request(server)
                                    .post('/api/shelves/user/1')
                                    .send(shelfObj)
                                    .set("cookie", cookie)
                                    .then(res => {
                                        return request(server)
                                            .post('/api/booksonshelf/shelves/1')
                                            .send({ book: bookObject2, readingStatus: 2 })
                                            .set("cookie", cookie)
                                                                    
                                    })                                      
                            })                        
					})
			})
	});
    
    describe("GET user books on shelf user shelfId", function() {
		it("GET res is shelf.Id", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
                    .get("/api/booksonshelf/shelves/1")
					.send({bookId: 1})
					.set("cookie", cookie)
					.then(res => {
                        
						expect(res.body[0].shelfId).toBe(1);
					});
                return req;
            
			});
        });

        it("GET res is user.Id", function() {
            return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
                const req = request(server)
                    .get("/api/booksonshelf/shelves/1")
                    .send({bookId: 1})
                    .set("cookie", cookie)
                    .then(res => {
                        expect(res.body[0].userId).toBe(1);
                    });
                return req;
            
            });
        });
        
    });
    
    describe("DELETE from shelf", function() {
        it("Delete book from shelf", function () {
            return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
            const req = request(server)
                .delete("/api/booksonshelf/shelves/1")
                .send({ bookId: 1 })
                .set("cookie", cookie)
                .then(res => {
                    expect(res.status).toBe(200)
                });
            return req;

            });
        });
	});

});