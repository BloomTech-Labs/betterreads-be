const db = require("../database/db-config.js");

module.exports = {
	add,
	findBy,
    total,
    edit
};

function add(user) {
	return db("users")
		.insert(user)
        .returning("*");
}

function findBy(filter) {
	return db("users")
		.where(filter)
		.first();
}

function total() {
	return db("users").count("id")
}

function edit(param, filter){
    return db("users")
        .where(filter)
        .update(param)
}
