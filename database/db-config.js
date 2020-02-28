const knex = require("knex");
const knexfile = require("../knexfile.js");

const env = process.env.DB_ENV || "development";
const config = knexfile[env];

module.exports = knex(config);
