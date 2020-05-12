module.exports = {
    addTag,
    editTag,
    deleteTag,
    getTag,
    getAllTagsForBook,
    getAllTagsForUser
};

const db = require("../database/db-config");

function addTag(userBooksId, tag) {
    return db("userBookTags")
        .insert({ bookTagName: tag, userBooksId })
};

function getAllTagsForBook(userBooksId) {
    return db("userBookTags")
        .where({ userBooksId })
        .distinct(
            "id as tagId",
            "bookTagName",
            "userBooksId"
        );
};

function getAllTagsForUser(userId) {
    return db("userBookTags as ubt")
        .join("userBooks as ub", "ubt.userBooksId", "ub.id")
        .where({ userId })
        .distinct(
            "ub.id as userBooksId",
            "ubt.bookTagName as bookTagName",
            "ub.userId as userId",
            "ubt.id as tagId"
        );
};

function getTag(tagId) {
    return db("userBookTags")
        .where({ id: tagId })
}

function editTag(tagId, newTag) {
    return db("userBookTags")
        .where({ id: tagId })
        .update({ bookTagName: newTag });
};

function deleteTag(tagId) {
    return db("userBookTags")
        .where({ id: tagId })
        .del();
};