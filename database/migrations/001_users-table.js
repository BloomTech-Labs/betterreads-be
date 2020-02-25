exports.up = knex => {
	return knex.schema.createTable("users", table => {
		table.increments();
		table.string("fullName").notNullable();
		table
			.string("emailAddress")
			.notNullable()
			.unique();
		table
			.string("username")
			.notNullable()
			.unique();
		table.string("password");
		table.string("image");
		table.string("googleID").unique();
		table.string("facebookID").unique();
	});
};

exports.down = knex => {
	return knex.schema.dropTableIfExists("users");
};
