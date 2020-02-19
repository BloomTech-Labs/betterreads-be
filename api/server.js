const express = require("express");
const helmet = require('helmet');
const cors = require('cors');

const server = express();
server.use(helmet())

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

server.use(cors(corsOptionsDelegate));
server.use(express.json());

server.get('/', (req, res) => res.status(200).json( { api: 'up!' } ));

module.exports = server;