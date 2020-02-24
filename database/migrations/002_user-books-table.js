exports.up = function(knex) {
	return knex.schema.createTable('userBooks', tbl => {
		tbl.increments();
		tbl.integer('bookId')
			.unsigned()
			.notNullable()
			.references('id')
			.inTable('books')
			.onDelete('CASCADE')
			.onUpdate('CASCADE');

		tbl.integer('readingStatus')
			.notNullable()
			.defaultTo(1);

		tbl.integer('userId')
			.unsigned()
			.notNullable()
			.references('id')
			.inTable('users')
			.onDelete('CASCADE')
			.onUpdate('CASCADE');
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists('userBooks');
};
