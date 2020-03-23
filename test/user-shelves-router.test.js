const server = require("../api/server.js");
const request = require("supertest");
const db = require("../database/db-config.js");
const TestObject = require("./test-objects.js");
const knexCleaner = require('knex-cleaner');

const shelfObj = TestObject.shelfObj;
const shelfObj2 = TestObject.shelfObj2;
const bookObject = TestObject.bookObject;
const promisedCookie = TestObject.promisedCookie;

var options = {
	mode: 'truncate',
	restartIdentity: true,
    ignoreTables: ['userShelves', 'userBooks']
    
};

describe("user-shelves-router", function() {
	// MARK: -- helper function to grab cookie

	beforeEach(async function() {
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
					.post("/api/shelves/user/1")
					.send(shelfObj)
					.set("cookie", cookie)
			})
    });
    
    describe("POST user shelves user Id", function() {
		it("POST res is user.Id", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.post("/api/shelves/user/1")
					.send(shelfObj)
					.set("cookie", cookie)
					.then(res => {
						expect(res.body[0].userId).toBe(1);
					});
				return req;
			});
        });
        
	});
	
	describe("PUT user shelves", function() {
		it("PUT res.status toBe 200", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.put("/api/shelves/1")
					.send(shelfObj2)
					.set("cookie", cookie)
					.then(res => {
						expect(res.status).toBe(200);
					});
				return req;
			});
        });

    });

    describe("GET user shelves user Id", function() {
		it("GET user.Id", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.get("/api/shelves/user/1")
					.set("cookie", cookie)
					.then(res => {
						expect(res.body[0].userId).toBe(1);
					});
				return req;
			});
        });
        
    });
	
});
