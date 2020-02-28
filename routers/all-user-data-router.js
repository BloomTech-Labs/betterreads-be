const router = require("express").Router();
const allUserData = require("../models/all-user-data");


router.get("/:id", (req, res) => {
	const userId = req.params.id
	allUserData.findByUserId(userId)
		.then(book =>{
              console.log(book)
        res.status(200).json(book)   
        }
		)
		.catch(err => res.status(500).json({ message: "All user data" }));
});

module.exports = router;
