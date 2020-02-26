const server = require("../api/server.js");
const request = require("supertest");
const db = require("../database/db-config.js");

describe("user-books-router", function() {

	const bookObject = {
		googleId: "qwoldmcdfiom123103",
		title: "Chantra Swandie",
		author: "McWorld",
		publisher: "Penguin",
		publishDate: "2/21/2020",
		description: "The end of the book",
		isbn10: "12345678911234567891",
		isbn13: "12345678911234567891234",
		pageCount: 210,
		categories: "swenad",
		thumbnail: "image.png",
		smallThumbnail: "small-img.png",
		language: "english",
		webRenderLink: "testLink",
		textSnippet: "testSnippet",
		isEbook: true
	};

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
		return request(server)
			.post("/api/auth/signin")
			.send({
				emailAddress: "seedemail",
				password: "seedpassword"
			}).then(res => {
				const cookie = res.headers["set-cookie"]
				return request(server)
					.post("/api/books")
					.send(bookObject)
					.set("cookie", cookie)
			})
	});

	describe("GET library", function() {
		it("GET failure", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.get("/api/1/library")
					.set("cookie", cookie)
					.then(res => {
						expect(res.body.message).toBe("error in returning data");
					})
				return req;
			});
		});
	});
});