
exports.up = function(knex) {
	return knex.schema.table("books", tbl => {
		tbl.decimal("averageRating");
	})
};

exports.down = function(knex) {
	return knex.schema.table("books", tbl => {
		tbl.dropColumn("averageRating");
	})
};
