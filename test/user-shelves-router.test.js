const server = require("../api/server.js");
const request = require("supertest");
const db = require("../database/db-config.js");

const knexCleaner = require('knex-cleaner');

var options = {
	mode: 'truncate',
	restartIdentity: true,
    ignoreTables: ['userShelves', 'userBooks']
    
};

describe("user-shelves-router", function() {
	const Test1 = {
        shelfName: " Test Shelf 1",
        isPrivate: false
    }
    const Test2 = {
        shelfName: " Test Shelf 2",
        isPrivate: false
    }
    const Test3 = {
        shelfName: " Test Shelf 3",
        isPrivate: false
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

	beforeEach(async function() {
		await knexCleaner.clean(db, options)
		return request(server)
			.post("/api/auth/signup")
			.send({
				fullName: "Seeder Apple",
				emailAddress: "seedemail",
				username: "seedusername",
				password: "seedpassword"
			}).then(res => {
				const cookie = res.headers["set-cookie"]
				return request(server)
					.post("/api/shelves/1")
					.send(Test1)
					.set("cookie", cookie)
			})
    });
    
    describe("POST user shelves user Id", function() {
		it("POST res is user.Id", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.post("/api/shelves/1")
					.send(Test1)
					.set("cookie", cookie)
					.then(res => {
						expect(res.body[0].userId).toBe(1);
					});
				return req;
			});
        });
        
	});
	
	describe("POST user shelves", function() {
		it("POST res shelfName toBe Test Shelf 1", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.post("/api/shelves/1")
					.send(Test1)
					.set("cookie", cookie)
					.then(res => {
						expect(res.body[0].shelfName).toBe(" Test Shelf 1");
					});
				return req;
			});
        });
        
	});
	
	describe("PUT user shelves", function() {
		it("PUT res message is userShelf: does not exist", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.put("/api/shelves/1000")
					.send(Test1)
					.set("cookie", cookie)
					.then(res => {
						expect(res.body.message).toBe( "userShelf: does not exist");
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
					.send(Test2)
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
