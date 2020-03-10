
exports.up = function(knex) {
	return knex.schema.table("books", tbl => {
		tbl.decimal("avgRating");
	})
};

exports.down = function(knex) {
	return knex.schema.table("books", tbl => {
		tbl.dropColumn("avgRating");
	})
};
