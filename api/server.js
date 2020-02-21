// MARK: -- Third party
const express = require("express");
const helmet = require('helmet');
const cors = require('cors');

// MARK: -- restricted middle-ware
const restricted = require('../auth/restricted-middleware');

// MARK: -- Routers
const authRouter = require('../auth/auth-router.js');
const booksRouter = require('../routers/book-router.js')

// MARK: -- cors settings
const whitelist = ['http://localhost:5000']
const corsOptionsDelegate = function (req, callback) {
	let corsOptions;
	if(whitelist.indexOf(req.header('Origin')) !== -1) {
		corsOptions = { credentials: true, origin: true }
	} else {
		corsOptions = { origin: false }
	}
	callback(null, corsOptions);
}

// MARK: -- server
const server = express();
server.use(helmet())
server.use(cors(corsOptionsDelegate));
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/books',restricted, booksRouter);

server.get('/', (req, res) => res.status(200).json( { api: 'up!' } ));

module.exports = server;