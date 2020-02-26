exports.up = knex => {
	return knex.schema.createTable("userGenre", table => {
		table.increments();
        table.string("genreName").notNullable();
        table.integer("userId")
			.unsigned()
			.notNullable()
			.references("id")
			.inTable("users")
			.onDelete("CASCADE")
			.onUpdate("CASCADE");
	});
};

exports.down = knex => {
	return knex.schema.dropTableIfExists("userGenre");
};
