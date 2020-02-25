exports.up = function(knex) {
	return knex.schema.createTable("books", tbl => {
		tbl.increments();
		tbl.string("googleId").notNullable();
		tbl.string("title").notNullable();
		tbl.string("author").notNullable();
		tbl.string("publisher").notNullable();
		tbl.string("publishDate").notNullable();
		tbl.string("description", 1000).notNullable();
		tbl.string("isbn10");
		tbl.string("isbn13");
		tbl.integer("pageCount").notNullable();
		tbl.string("categories").notNullable();
		tbl.string("thumbnail").notNullable();
		tbl.string("smallThumbnail").notNullable();
		tbl.string("language").notNullable();
		tbl.string("webRenderLink").notNullable();
		tbl.string("textSnippet", 1000).notNullable();
		tbl.boolean("isEbook").notNullable();
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists("books");
};
