exports.up = function(knex) {
	return knex.schema.createTable("books", tbl => {
		tbl.increments();
		tbl.string("googleId").notNullable();
		tbl.string("title");
		tbl.string("authors");
		tbl.string("publisher");
		tbl.string("publishedDate");
		tbl.string("description", 10000);
		tbl.string("isbn10");
		tbl.string("isbn13");
		tbl.integer("pageCount");
		tbl.string("categories");
		tbl.string("thumbnail");
		tbl.string("smallThumbnail");
		tbl.string("language");
		tbl.string("webReaderLink");
		tbl.string("textSnippet", 10000);
		tbl.boolean("isEbook");
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists("books");
};
