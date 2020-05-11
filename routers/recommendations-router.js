const router = require("express").Router();
const UserBooks = require("../models/user-books.js");
const axios = require("axios");
const { decode } = require("../auth/mobileTokenGenerator");
const UserShelves = require("../models/user-shelves");
const UserBooksOnShelf = require("../models/user-books-on-a-shelf");

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const fetchData = (userID) => {
  return new Promise((resolve, reject) => {
    const result = [];

    UserShelves.findByUser(6)
      .then((res) => {
        res.forEach((shelf) => {
          UserBooksOnShelf.findAllBooks(shelf.shelfId, 6)
            .then((res) => {
              if (res.books.length > 0) {
                axios
                  .post("https://dsapi.readrr.app/recommendations", res.books)
                  .then((recs) => {
                    const resObject = {
                      basedOn: `Based on ${shelf.shelfName}`,
                      recommendations: recs.data.recommendations,
                    };
                    result.push(resObject);
                  })
                  .catch((err) => reject(err));
              } else {
                console.log("No Books in shelf");
              }
            })
            .catch((err) => reject(err));
        });
        wait(3000).then(() => resolve(result));
      })
      .catch((err) => reject(err));
  });
};

router.get("/recommendations", (request, response) => {
  const token = decode(request.headers.authorization);
  if (token.subject) {
    const id = token.subject;
    fetchData(id)
      .then((res) => response.status(200).send(res))
      .catch((err) => response.status(500).send(err));
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
