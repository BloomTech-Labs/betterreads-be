const router = require("express").Router();
const UserBooks = require("../models/user-books.js");
const axios = require("axios")

router.get("/:userId/recommendations", (req, res) => {
   const userId = req.params.userId;
   UserBooks.findByUserId(userId)
        .then(books => {
            axios.post("http://staging-env.eba-mydnqmmk.us-east-1.elasticbeanstalk.com/recommendations", books)
            .then(recs => {
                const recIds = recs.data.recommendations.map(rec => rec.id);
                const convertedIds = () => {
                    const convertedData = []
                    for(let i = 0; i < recIds.length; i++){
                        let obj = {};
                        const newObj = { ...obj, googleId: `${ recIds[i] }` }
                        convertedData.push(newObj)
                    }
                    return convertedData
                }
                
                res.status(200).json({ message: "recommendations retrieved successfully", recommendations: convertedIds() })
            })
            .catch(({ name, message, stack }) => res.status(500).json({ error: "error retrieving recommendations", name, message, stack }))})
        .catch(({ name, message, stack }) => res.status({ error: "could not find a user by the requested id", name, message, stack }))            
})

module.exports = router; 