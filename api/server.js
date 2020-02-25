// MARK: -- third party
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("passport");
const passportSetup = require("../config/passport-setup");
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);
const config = require("../database/db-config");

// MARK: -- restricted middleware
const restricted = require("../auth/restricted-middleware.js");

// MARK: -- routers
const authRouter = require("../auth/auth-router.js");
const booksRouter = require("../routers/book-router.js");
const userBooksRouter = require("../routers/user-books-router.js");

// MARK: -- server
const server = express();

server.use(express.json());
server.use(helmet());

// MARK: -- cors
server.use(cors({ credentials: true, origin: "http://localhost:3000" }));

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

server.use("/api/auth", authRouter);
server.use("/api/books", booksRouter);
server.use("/api", userBooksRouter);

server.get("/", (request, response) =>
	response.status(200).json({ message: "server is working" })
);

module.exports = server;
