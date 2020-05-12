//reading status legend
// 1: to be read
// 2: in progress
// 3: completed

const router = require("express").Router();

const userBooks = require("../models/user-books");

router.get("/stats", async (req, res) => {
    const readingStatus1 = await userBooks.userWideStats({ readingStatus: 1 });
    const readingStatus2 = await userBooks.userWideStats({ readingStatus: 2 });
    const readingStatus3 = await userBooks.userWideStats({ readingStatus: 3 });
    
    res.status(200).json({ 
        message: "user-wide stats retrieved", 
        toBeRead: Number(readingStatus1[0].count), 
        inProgress: Number(readingStatus2[0].count), 
        completed: Number(readingStatus3[0].count) 
    });
});

router.get("/stats/:userId", async (req, res) => {
    const userId = Number(req.params.userId);
    let readingStatus1, readingStatus2, readingStatus3
    await userBooks.userStats(userId, 1)
        .then( res => readingStatus1 = res)
    await userBooks.userStats(userId, 2)
        .then( res => readingStatus2 = res)
    await userBooks.userStats(userId, 3)
        .then( res => readingStatus3 = res)
    if (readingStatus1.message === "cannot find user" || 
        readingStatus2.message === "cannot find user" || 
        readingStatus3.message === "cannot find user") {
            res.status(404).json({ message: "requested user cannot be found" })
    } else { 
        const toBeRead = readingStatus1[0].count,
            inProgress = readingStatus2[0].count,
            completed = readingStatus3[0].count
        res.status(200).json({ message: "stats for the requested user retrieved", toBeRead, inProgress, completed })
    };
});

module.exports = router;
