// MARK: -- third party
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("passport");

const passportSetup = require("../config/passport-setup.js");
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);
const config = require("../database/db-config.js");

// MARK: -- restricted middleware
const restricted = require("../auth/restricted-middleware.js");

// MARK: -- routers
const authRouter = require("../auth/auth-router.js");
const booksRouter = require("../routers/book-router.js");
const userBooksRouter = require("../routers/user-books-router.js");
const userShelvesRouter = require ("../routers/user-shelves-router.js")
const userBooksOnShelfRouter = require ("../routers/user-books-on-a-shelf-router.js");
const userGenre = require ("../routers/user-genre-router.js");
const allUserData = require("../routers/all-user-data-router.js");

// MARK: -- for data science
const UserBooks = require("../models/user-books.js");
const helper = require("../routers/helpers.js");


// MARK: -- server
const server = express();

server.use(express.json());
server.use(helmet());

// MARK: -- cors
var corsOptions = {
	origin: process.env.BASE_URL || "http://localhost:3000",
	methods: "GET,PUT,POST,DELETE",
   	credentials: true
}
server.use(cors(corsOptions));

// MARK: -- session and cookie configuration
server.use(
	session({
		name: process.env.SESSION_NAME,
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 7,
			secure: false
		},
		store: new knexSessionStore({
			knex: config
		})
	})
);

// MARK: -- passport
server.use(passport.initialize());
server.use(passport.session());

server.get(process.env.DATA_SCIENCE, (req, res) => {
	const userId = req.params.userId;
	return helper.findIn(req, res, UserBooks.findByUserId, userId, "userbooks")
});

server.use("/api/auth", authRouter);
server.use("/api/books", restricted, booksRouter);
server.use("/api", restricted, userBooksRouter);
server.use("/api/shelves", restricted, userShelvesRouter);
server.use("/api/booksonshelf", restricted, userBooksOnShelfRouter);
server.use("/api/genre", restricted, userGenre); 
server.use("/api/userData", restricted, allUserData);


server.get("/", (request, response) =>
	response.status(200).json({ message: "server is working" })
);

module.exports = server;
