const router = require("express").Router();
const AllUserData = require("../models/all-user-data.js");


router.get("/:id", (req, res) => {
	const userId = req.params.id
	AllUserData.findBy(userId)
		.then(data => {
			res.status(200).json(data);
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({ message: "All user data" })
		});
});

module.exports = router;
