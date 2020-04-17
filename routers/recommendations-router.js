const router = require("express").Router();
const UserBooks = require("../models/user-books.js");
const axios = require("axios")

router.get("/:userId/recommendations", (req, res) => {
   const userId = req.params.userId;
   UserBooks.findByUserId(userId)
        .then(books => {
            console.log(books)
            axios.post("http://localhost:5001/", books)
            .then(recs => res.status(200).json({ message: "recommendations retrieved successfully", recommendations: recs.data }))
            .catch(({ name, message, stack }) => res.status(500).json({ error: "error retrieving recommendations", name, message, stack }))})
        .catch(({ name, message, stack }) => res.status({ error: "could not find a user by the requested id", name, message, stack }))            
    
})

module.exports = router; 