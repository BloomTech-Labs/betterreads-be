exports.up = function(knex) {
	return knex.schema.createTable("userBooks", tbl => {
		tbl.increments();
		tbl.integer("bookId")
			.unsigned()
			.notNullable()
			.references("id")
			.inTable("books")
			.onDelete("CASCADE")
			.onUpdate("CASCADE");

		tbl.integer("userId")
			.unsigned()
			.notNullable()
			.references("id")
			.inTable("users")
			.onDelete("CASCADE")
			.onUpdate("CASCADE");

		tbl.integer("readingStatus").defaultTo(1);

		tbl.datetime("dateStarted");
		tbl.datetime("dateEnded");
		tbl.timestamp("dateAdded", 20).defaultTo(knex.fn.now());
		tbl.boolean("favorite").defaultTo(false);
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists("userBooks");
};
