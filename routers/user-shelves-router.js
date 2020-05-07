const helper = require("./helpers.js");
const router = require("express").Router();
const Shelves = require("../models/user-shelves.js");

router.post("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    const { shelfName, isPrivate } = req.body;
    const userShelfObj = { userId, shelfName, isPrivate };
    const shelves = await Shelves.findByUser(userId);
        if (shelves.map((shelf) => shelf.shelfName === shelfName).includes(true)) { res.status(400).json({ message: "shelf already exists" })
        } else {
            Shelves.add(userShelfObj)
                .then((userShelf) => { res.status(201).json(userShelf[0])})
                .catch(({ name, message, stack }) => { res.status(500).json({ error: "error adding shelf", name, message, stack })});
        }
});

router.get("/user/:userId", (req, res) => {
    const userId = req.params.userId;
    helper.findIn(req, res, Shelves.findByUser, userId);
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
        isPrivate: isPrivate,
    };

    Shelves.findBy(shelfId).then((shelf) => {
        if (shelf.length > 0) {
            const shelfId = shelf[0].shelfId;
            Shelves.update(updatedShelfobj, shelfId)
                .then((updatedShelf) => {
                    if (updatedShelf) { res.status(201).json({ message: "updated successfully" })
                    } else { res.status(500).json({ error: "error updating" })}
                })
                .catch(({ name, message, stack }) => { res.status(500).json({ error: "shelf not updated", name, message, stack })});
        } else { res.status(404).json({ message: "userShelf: does not exist" })}
    });
});

router.delete("/:shelfId", (req, res) => {
    const id = req.params.shelfId;
    Shelves.findBy(id).then((shelf) => {
        if (shelf.length > 0) {
            const id = shelf[0].shelfId;
            Shelves.remove(id)
                .then((deletedShelf) => { res.status(200).json({ message: "shelf deleted successfully" })})
                .catch(({ name, message, stack }) => { res.status(500).json({ message: "Could not remove shelf", name, message, stack })});
        } else { res.status(404).json({ message: "userShelf: does not exist" })}
    });
});

module.exports = router;
