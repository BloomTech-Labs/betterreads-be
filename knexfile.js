require("dotenv").config();
const pg = require("pg");

const connect = (database_name) => ({
	host: process.env.HOST,
	user: process.env.DB_USER,
	password: process.env.PASSWORD,
	database: database_name
})

module.exports = {
	development: {
		client: "pg",
		connection: connect(process.env.DB),
		pool: {
			min: 2,
			max: 100
		},
		useNullAsDefault: true,
		migrations: {
			directory: "./database/migrations"
		},
		seeds: {
			directory: "./database/seeds"
		}
	},

	staging: {
		client: "pg",
		connection: process.env.RDS_HOSTNAME,
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: "./database/migrations"
		}
	},

	production: {
		client: "pg",
		connection: process.env.RDS_HOSTNAME,
		pool: {
			min: 2,
			max: 100
		},
		migrations: {
			directory: "./database/migrations"
		}
	},

	testing: {
		client: "pg",
		connection: connect(process.env.TEST_DB),
		useNullAsDefault: true,
		migrations: {
			directory: "./database/migrations"
		},
		seeds: {
			directory: "./database/seeds"
		}
	}
};
