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
const mobileAuthRouter = require("../auth/auth-mobile");
const booksRouter = require("../routers/book-router.js");
const userBooksRouter = require("../routers/user-books-router.js");
const userShelvesRouter = require("../routers/user-shelves-router.js");
const userBooksOnShelfRouter = require("../routers/user-books-on-a-shelf-router.js");
const userGenre = require("../routers/user-genre-router.js");
const recRouter = require("../routers/recommendations-router");
const passwordReset = require("../routers/password-reset");
const statsRouter = require("../routers/stats-router");
const bookTagRouter = require("../routers/book-tagging-router");

// MARK: -- for data science
const UserBooks = require("../models/user-books.js");
const Users = require("../models/users.js");
const helper = require("../routers/helpers.js");

// MARK: -- server
const server = express();

server.use(express.json());
server.use(helmet());

// MARK: -- cors
var corsOptions = {
  origin: process.env.BASE_URL || "http://localhost:3000",
  methods: "GET,PUT,POST,DELETE",
  credentials: true,
};
server.use(cors(corsOptions));

// MARK: -- data science
server.get(process.env.DATA_SCIENCE || "/api/ds/:userId", (req, res) => {
  const userId = req.params.userId;
  return helper.findIn(req, res, UserBooks.findByUserId, userId, "userbooks");
});

server.get(process.env.DATA_SCIENCE_TOTAL || "/api/dstotal", (req, res) => {
  Users.total()
    .then((total) => res.status(200).json(total))
    .catch(({ name, message, stack }) =>
      res
        .status(500)
        .json({ error: "error retrieving data", name, message, stack })
    );
});

// MARK: -- passport
server.use(passport.initialize());
server.use(passport.session());

// MARK: -- routers
server.use("/api/auth/reset", passwordReset);
server.use("/api/auth", authRouter);
server.use("/api/auth/mobile", mobileAuthRouter);
server.use("/api/books", restricted, booksRouter);
server.use("/api/stats", statsRouter);
server.use("/api", restricted, userBooksRouter);
server.use("/api", restricted, recRouter);
server.use("/api/shelves", restricted, userShelvesRouter);
server.use("/api/booksonshelf", restricted, userBooksOnShelfRouter);
server.use("/api/genre", restricted, userGenre);
server.use("/api/tags", restricted, bookTagRouter);

server.get("/", (request, response) =>
  response.status(200).json({ message: "server is working" })
);

module.exports = server;
