const router = require("express").Router();
const Genre = require("../models/user-genre");

// MARK: -- needs to be refactored

router.get("/:userId", (req, res) => {
    const userId = req.params.userId;
    Genre.findByUserId(userId)
        .then(genres => {
            if (genres.length < 1) {
                res.status(400).json({ message: "Genres not found for User" });
            } else {
                res.status(200).json(genres);
            }
        })
        .catch(({ name, message, stack }) => {
            res.status(500).json({ error: "error in returning data", name, message, stack });
        });
});

router.post("/", (req, res) => {
    const { userId, genreName } = req.body 
    const userGenreObj = { userId, genreName }
    Genre.findByUserId(userId).then(genres => {
        const genre = genres.filter(genre => genre.genreName === genreName)
        if (!genres.map(genre => genre.genreName).includes(genreName)) {
            Genre.add(userGenreObj)
                .then(userGenre => {
                    const genre = userGenre[0]
                    res.status(201).json({ message: "genre added successfully", genre})
                })
                .catch(({ name, message, stack}) => {
                    res.status(400).json({ failed: "failed to add user genre", name, message, stack });
                });
        } else {
            res.status(400).json({
                message:
                   "genre already exists for the user" 
            });
        }
    });
});

router.put("/:userId/:genreId", (req, res) => {
    const userId = req.params.userId;
    const updatedGenreName = req.body.genreName;
    const genreId = req.params.genreId;
    
    Genre.findByUserId(userId).then(genres => {
        const userGenreArray = genres.filter(genre => genre.id == genreId);
        const userGenre = userGenreArray[0];
        if (userGenre) {
            const updatedGenre = { ...userGenre, genreName: updatedGenreName }
            Genre.update(updatedGenre, userId, genreId)
                .then(genre => {
                    res.status(201).json({ message: "genre updated successfully", updatedGenre})
                    })
                .catch(({ name, message, stack }) => {
                    res.status(400).json({
                        error: "failed to update user genre", name, message, stack
                    });
                });
            } else {
            res.status(404).json({ message: "userGenre not found" });
        }
    });
});

router.delete("/:userId/:genreId", (req, res) => {
    const userId = req.params.userId;
    const genreId = req.params.genreId;
    Genre.findByUserId(userId).then(genres => {
        if (genres.map(genre => genre.id == genreId).includes(true)) {
            Genre.remove(userId, genreId)
                .then(genre => {
                    res.status(200).json({
                        message: "genre deleted successfully",
                        genreId: genre.genreId,
                        genreName: genre.genreName
                    });
                })
                .catch(({ name, message, stack }) => {
                    res.status(400).json({
                        error: "failed to delete user genre", name, message, stack
                    });
                });
        } else {
            res.status(404).json({ message: "genre not found" });
        }
    });
});
module.exports = router;
