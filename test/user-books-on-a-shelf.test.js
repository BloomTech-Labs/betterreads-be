const server = require("../api/server.js");
const request = require("supertest");
const db = require("../database/db-config.js");
const TestObject = require("./test-objects.js");
const knexCleaner = require('knex-cleaner');

const shelfObj = TestObject.shelfObj;
const bookObject = TestObject.bookObject;
const promisedCookie = TestObject.promisedCookie;

var options = {
	mode: 'truncate',
	restartIdentity: true,
    ignoreTables: ['userShelves', 'userBooks', 'userBooksOnAShelf']
    
};

describe("user-books-on-a-shelf", function() {

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
                    .post('/api/shelves/user/1')
                    .send(shelfObj)
                    .set("cookie", cookie)
                    .then(res => {
                        return request(server)
                            .post('/api/booksonshelf/shelves/1')
                            .send({ book: bookObject, readingStatus: 2 })
                            .set("cookie", cookie)                             
					   })
			     })
	});
    
    describe("GET user books on shelf user shelfId", function() {
		it("GET /booksonshelf/shelves/:shelfId", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
                    .get("/api/booksonshelf/shelves/1")
					.send({ bookId: 1 })
					.set("cookie", cookie)
					.then(res => {
						expect(res.status).toBe(200);
					});
                return req;
            
			});
        });

        it("GET /booksonshelf/shelves/allbooks/:shelfId", function() {
            return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
                const req = request(server)
                    .get("/api/booksonshelf/shelves/allbooks/1")
                    .send({ userId: 1 })
                    .set("cookie", cookie)
                    .then(res => {
                        expect(res.status).toBe(200);
                    });
                return req;
            
            });
        });

        it("GET /booksonshelf/user/:userId", function() {
            return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
                const req = request(server)
                    .get("/api/booksonshelf/user/1")
                    .set("cookie", cookie)
                    .then(res => {
                        expect(res.body[0].shelfName).toBe('Test shelf');
                    });
                return req;
            
            });
        });
    });

    describe("PUT user books on shelf", function() {
        it("PUT /booksonshelf/shelves/:shelfId", function() {
            return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
                const req = request(server)
                    .put("/api/booksonshelf/shelves/1")
                    .send({ bookId: 1, newShelfId: 2 })
                    .set("cookie", cookie)
                    .then(res => {
                        expect(res.body.message).toBe("error in moving book to shelf");
                    });
                return req;
            
            });
        });
    })
    
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