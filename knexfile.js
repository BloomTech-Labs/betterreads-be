require("dotenv").config();
const pg = require("pg");

module.exports = {
	development: {
		client: "pg",
		connection: {
			host: process.env.HOST,
			user: process.env.DB_USER,
			password: process.env.PASSWORD,
			database: process.env.DB
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
		client: "postgresql",
		connection: {
			database: "my_db",
			user: "username",
			password: "password"
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: "knex_migrations"
		}
	},

	production: {
		client: "pg",
		connection: process.env.RDS_HOSTNAME,
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			directory: "./database/migrations"
		}
	},

	testing: {
		client: "pg",
		connection: {
			host: process.env.HOST,
			user: process.env.DB_USER,
			password: process.env.PASSWORD,
			database: process.env.TEST_DB
		},
		useNullAsDefault: true,
		migrations: {
			directory: "./database/migrations"
		},
		seeds: {
			directory: "./database/seeds"
		}
	}
};
