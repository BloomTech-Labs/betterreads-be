const router = require("express").Router();
const UserBooks = require("../models/user-books.js");
const axios = require("axios");
const { decode } = require("../auth/mobileTokenGenerator");
const UserShelves = require("../models/user-shelves");
const UserBooksOnShelf = require("../models/user-books-on-a-shelf");

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const fetchShelves = async (userID) => {
  try {
    return await UserShelves.findByUser(userID);
  } catch (err) {
    console.log(err);
    return err;
  }
};

const fetchBooksOnShelf = async (shelfID, userID) => {
  try {
    return await UserBooksOnShelf.findAllBooks(shelfID, userID);
  } catch (err) {
    console.log(err);
    return err;
  }
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const fetchRecs = async (shelves, id) => {
  const result = [];
  asyncForEach(shelves, async (shelf) => {
    const shelfInfo = await fetchBooksOnShelf(shelf.shelfId, id);
    if (shelfInfo.books.length > 0) {
      axios
        .post("https://dsapi.readrr.app/recommendations", shelfInfo.books)
        .then((recs) => {
          const resObject = {
            basedOn: `Based on ${shelfInfo.shelfName}`,
            shelf: shelfInfo,
            recommendations: recs.data.recommendations,
          };
          result.push(resObject);
        })
        .catch((err) => {
          response.status(500).json({ error: err });
        });
    } else {
      const resObject = {
        shelf: shelfInfo,
      };
      result.push(resObject);
    }
  });
  await wait(5000);
  return result;
};

router.get("/recommendations", async (request, response) => {
  const token = decode(request.headers.authorization);
  if (token.subject) {
    const id = token.subject;
    const shelves = await fetchShelves(id);
    const result = await fetchRecs(shelves, id);
    response.send(result);
  } else {
    response.status(401).json({ error: "Token is not valid" });
  }
});

router.get("/:userId/recommendations", (req, res) => {
  const userId = req.params.userId;

  UserBooks.findByUserId(userId)
    .then((books) => {
      axios
        .post("https://dsapi.readrr.app/recommendations", books)
        .then((recs) =>
          res.status(200).json({
            message: "recommendations retrieved successfully",
            recommendations: recs.data,
          })
        )
        .catch(({ name, message, stack }) =>
          res
            .status(404)
            .json({ error: "invalid user ID", name, message, stack })
        );
    })
    .catch(({ name, message, stack }) =>
      res.status(404).json({
        error: "could not find a user by the requested id",
        name,
        message,
        stack,
      })
    );
});

router.post("/:userId/recommendations", (req, res) => {
  const { books } = req.body;
  if (books.length === 0) {
    res.status(400).json({ message: "no books sent" });
  } else {
    axios
      .post("https://dsapi.readrr.app/recommendations", books)
      .then((recs) =>
        res.status(200).json({
          message: "recommendations retrieved successfully",
          recommendations: recs.data,
        })
      )
      .catch(({ name, message, stack }) =>
        res
          .status(400)
          .json({ error: "no books were sent", name, message, stack })
      );
  }
});

module.exports = router;
