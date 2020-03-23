const server = require("../api/server.js");
const request = require("supertest");
module.exports = {
	// MARK: -- helper function to grab cookie
	promisedCookie: function(user) {
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
	},

	bookObject: {
		googleId: "qwoldmcdfiom123103",
		title: "Chantra Swandie",
		authors: "McWorld",
		publisher: "Penguin",
		publishedDate: "2/21/2020",
		description: "The end of the book",
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
	},

	otherBook: {
		googleId: "qwertyomsname",
		title: "Lander McPherson",
		authors: "Civil Mary",
		publisher: "Top hat",
		publishedDate: "4/2/1931",
		description: "The begining of the book",
		isbn10: "0293129582812931832914",
		isbn13: "90w8q9weqw9eq0w9e0w9eq9",
		pageCount: 100,
		categories: "mapry",
		thumbnail: "image.png",
		smallThumbnail: "small-img.png",
		language: "english",
		webReaderLink: "testLink",
		textSnippet: "testSnippet",
		isEbook: false,
		averageRating: 4
	},

	badBookObject: {
		type: "Movie",
		content: "Im not a book"
	},

	shelfObj: {
		shelfName: "Test shelf",
    	isPrivate: false
	},

	shelfObj2: {
        shelfName: " Test Shelf 1",
        isPrivate: false
    },

	shelfWithBook: {
	    bookId: 1,
    	shelfId: 1	
	},

};