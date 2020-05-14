const db = require("../database/db-config.js");
const UserShelves = require("./user-shelves.js");

module.exports = {
  findBook,
  findAllBooks,
  returnEveryShelfFrom,
  findBooksIn,
  addBooks,
  update,
  remove,
  removeAll,
};

function findBook(shelfId, bookId) {
  return db("userBooksOnAShelf as bs")
    .join("books as b", "bs.bookId", "b.id")
    .join("userShelves as s", "s.id", "bs.shelfId")
    .where({ shelfId: shelfId })
    .where("bs.bookId", bookId)
    .select("bs.bookId", "b.title", "s.shelfName", "bs.shelfId", "s.userId");
}

function findAllBooks(shelfId, userId) {
  return db("userBooksOnAShelf as bs")
    .join("books as b", "bs.bookId", "b.id")
    .join("userBooks as ub", "ub.bookId", "bs.bookId")
    .where("ub.userId", userId)
    .join("userShelves as s", "s.id", "bs.shelfId")
    .where({ shelfId })
    .distinct(
      "b.*",
      // "bs.bookId",
      // "b.googleId",
      // "b.title",
      // "b.authors",
      // "b.publisher",
      // "b.thumbnail",
      // "b.smallThumbnail",
      "bs.shelfId",
      "s.userId",
      "s.shelfName",
      "ub.userRating",
      "ub.readingStatus",
      "ub.favorite"
    )
    .then((books) => {
      return db("userShelves as s")
        .where({ id: shelfId })
        .select("s.shelfName")
        .first()
        .then((name) => {
          const shelfName = name.shelfName;
          return {
            shelfId,
            shelfName,
            books,
          };
        });
    });
}

function returnEveryShelfFrom(userId) {
  return new Promise((resolve) => {
    UserShelves.returnShelfId(userId).then((res) => {
      if (res.length > 0) {
        resolve(res);
      }
    });
  });
}

function findBooksIn(shelfId) {
  return db("userBooksOnAShelf as bs")
    .join("books as b", "bs.bookId", "b.id")
    .join("userShelves as s", "s.id", "bs.shelfId")
    .where({ shelfId: shelfId })
    .select(
      "bs.bookId",
      "b.title",
      "b.authors",
      "b.thumbnail",
      "b.smallThumbnail",
      "b.googleId",
      "bs.shelfId",
      "s.userId"
    );
}

function findById(id) {
  return db("userBooksOnAShelf").where({ id }).first().select("*");
}

async function addBooks(book) {
  const [id] = await db("userBooksOnAShelf").insert(book).returning("id");
  return findById(id);
}

function update(bookId, shelfId, newShelfId) {
  return db("userBooksOnAShelf")
    .where({ bookId: bookId, shelfId: shelfId })
    .update({ shelfId: newShelfId })
    .returning("*");
}

function remove(bookId, shelfId) {
  return db("userBooksOnAShelf")
    .where({ bookId: bookId, shelfId: shelfId })
    .del();
}

function removeAll(bookId, userId) {
  return db("userBooksOnAShelf")
    .join("userShelves as us", "userBooksOnAShelf.shelfId", "us.id")
    .where({ bookId })
    .where("us.userId", userId)
    .select("shelfId")
    .then((id) => {
      id.map((del) => {
        remove(bookId, del.shelfId);
      });
      return id;
    });
}
