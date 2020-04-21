exports.up = function(knex) {
	return knex.schema.createTable("books", tbl => {
		tbl.increments();
		tbl.string("googleId").notNullable();
		tbl.string("title");
		tbl.string("authors", 1000);
		tbl.string("publisher", 1000);
		tbl.string("publishedDate");
		tbl.string("description", 10000);
		tbl.string("isbn10");
		tbl.string("isbn13");
		tbl.integer("pageCount");
		tbl.string("categories", 1000);
		tbl.string("thumbnail", 1000);
		tbl.string("smallThumbnail", 1000);
		tbl.string("language");
		tbl.string("webReaderLink", 1000);
		tbl.string("textSnippet", 10000);
		tbl.boolean("isEbook");
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists("books");
};
