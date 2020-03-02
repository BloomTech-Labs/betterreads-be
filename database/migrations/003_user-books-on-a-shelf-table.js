exports.up = function(knex) {
	return knex.schema.createTable("userBooksOnAShelf", tbl => {
		tbl.increments();
		tbl.integer("bookId")
			.unsigned()
			.notNullable()
			.references("id")
			.inTable("books")
			.onDelete("CASCADE")
			.onUpdate("CASCADE");
		tbl.integer("shelfId")
			.unsigned()
			.notNullable()
			.references("id")
			.inTable("userShelves")
			.onDelete("CASCADE")
			.onUpdate("CASCADE");
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists("userBooksOnAShelf");
};
