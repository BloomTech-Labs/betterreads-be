const helper = require("./helpers.js");
const router = require("express").Router();
const Shelves = require("../models/user-shelves.js");

router.post("/user/:userId", (req, res) => {
  const userId = req.params.userId;
  const shelfName = req.body.shelfName;
  const isPrivate = req.body.isPrivate;

  const userShelfObj = {
    userId: userId,
    shelfName: shelfName,
    isPrivate: isPrivate
  };
  
  Shelves.add(userShelfObj)
    .then(userShelf => {
      if (userShelf == undefined) {
        res.status(400).json({ message: "userShelf: does not exist" });
      } else {
        res.status(200).json(userShelf);
      }
    })
    .catch(err => {
      res.status(500).json({ message: "error in returning data" });
    });
});

router.get("/user/:userId", (req, res) => {
  const userId = req.params.userId;
  helper.findIn(req, res, Shelves.findBy, userId);
});

router.get("/:shelfId", (req, res) => {
  const shelfId = req.params.shelfId;
  helper.findIn(req, res, Shelves.findBy, shelfId);
});

router.put("/:shelfId", (req, res) => {
  const shelfId = req.params.shelfId;
  const shelfName = req.body.shelfName;
  const isPrivate = req.body.isPrivate;

  const updatedShelfobj = {
    id: Number(shelfId),
    shelfName: shelfName,
    isPrivate: isPrivate
  };

  Shelves.findBy(shelfId).then(shelf => {
    if (shelf.length > 0) {
      const shelfId = shelf[0].shelfId;
      Shelves.update(updatedShelfobj, shelfId)
        .then(updatedShelf => {
          res.status(200).json(updatedShelf);
        })
        .catch(err => {
          res.status(500).json({ message: "shelf not updated" });
        });
    } else {
      res.status(404).json({ message: "userShelf: does not exist" });
    }
  });
});

router.delete("/:shelfId", (req, res) => {
  const id = req.params.shelfId;
  Shelves.findBy(id).then(shelf => {
    if (shelf.length > 0) {
      const id = shelf[0].shelfId;

      Shelves.remove(id)
        .then(deletedShelf => {
          res.status(200).json(deletedShelf);
        })
        .catch(err => {
          res.status(500).json({ message: "Could not remove shelf" });
        });
    } else {
      res.status(404).json({ message: "userShelf: does not exist" });
    }
  });
});

module.exports = router;
