
exports.up = function(knex) {
	return knex.schema.table("userBooks", tbl => {
		tbl.decimal("userRating");
	})
};

exports.down = function(knex) {
	return knex.schema.table("userBooks", tbl => {
		tbl.dropColumn("userRating");
	})
};
