const knexCleaner = require("knex-cleaner");

var options = {
  ignoreTables: ["knex_migrations", "knex_migrations_lock"]
};

exports.seed = function(knex) {
  return knexCleaner.clean(knex, options)
};
