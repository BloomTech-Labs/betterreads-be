
exports.up = function(knex) {
    return knex.schema.createTable('userShelves', tbl => {
        tbl.increments();
        tbl.integer('userId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
        tbl.string('shelfName')
        .notNullable()
        tbl.boolean('isPrivate')
        .defaultTo(false)

    })
  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('userShelves')
};
