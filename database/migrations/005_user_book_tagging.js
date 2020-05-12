
exports.up = function(knex) {
    return knex.schema.createTable("userBookTags", table => {
        table.increments();
        table.string("bookTagName").notNullable();
        table.integer("userBooksId")
            .references("id")
            .inTable("userBooks")
            .notNullable()
            .onDelete("CASCADE")
            .onUpdate("CASCADE");   
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("userBookTags")
};
