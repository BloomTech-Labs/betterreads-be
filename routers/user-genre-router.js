const router = require("express").Router();
const Genre = require("../models/user-genre");





router.get("/:id", (req, res) => {
	const userId = req.params.id;
    Genre.findByUserId(userId)
        .then(userGenre => {
            console.log(" userGenre ",userGenre)
			if (!userGenre[0]) {
				res.status(400).json({ message: "Genre not found for User" });
			} else {
				res.status(200).json(userGenre[0]);
			}
		})
		.catch(err =>{
            res.status(500).json({ message: "error in returning data" })
            console.log(err) 
        }
            
		);
});

router.post("/", (req, res) => {
    const userId = req.body.userId;
    const genreName = req.body.genreName;
    const userGenreObj = {
        userId: userId,
        genreName: genreName
    }
    Genre.findByUserId(userId)
    .then(genre => {
        console.log("genre", genre, genre.length)
        if (!genre[0]){
            Genre.add(userGenreObj)
            .then(userGenre => {
                res.status(201).json(userGenre)
                console.log("userGenre",userGenre);
            })
            .catch(err => {
                res.status(500).json({message: "failed to add user genre"}); 
                console.log(err)
            })
        } else {
                res.status(500).json({ message: "userGenre Tbl already exist make Put request to update existing Tbl" })
        }
    } )
});

router.put("/", (req, res) => {
    const userId = req.body.userId;
    const updatedGenreName = req.body;
    
    Genre.findByUserId(userId)
    .then(genre => {
        const genreUserId = genre[0].userId;

        if (genreUserId){
            Genre.update(updatedGenreName, genreUserId)
            .then(userGenre => {
                res.status(201).json({message: "User genre Update Successful", userGenreId: userGenre})
                
            })
            .catch(err => {
                res.status(500).json({message: "failed to update user genre"}); 
                 console.log(err)
            })
        } else {
                res.status(500).json({ message: "userGenre not found" })
        }
    } )
});

router.delete("/:userId", (req, res) => {
    const userId = req.params.userId;
   
    Genre.findByUserId(userId)
    .then(genre => {
        
        if (genre){
            Genre.remove(userId)
            .then(userGenre => {
                res.status(201).json({message: "User genre Deleted", userGenreId: userGenre})
                
            })
            .catch(err => {
                res.status(500).json({message: "failed to delete user genre"}); 
                 console.log(err)
            })
        } else {
                res.status(500).json({ message: "userGenre not found" })
        }
    } )
});

module.exports = router;
