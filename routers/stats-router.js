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
    const userId = req.params.userId;
    const readingStatus1 = await userBooks.userStats({ userId, readingStatus: 1 });
    const readingStatus2 = await userBooks.userStats({ userId, readingStatus: 2 });
    const readingStatus3 = await userBooks.userStats({ userId, readingStatus: 0 });

    res.status(200).json({ 
        message: "stats for the requested user retrieved", 
        toBeRead: Number(readingStatus1[0].count), 
        inProgress: Number(readingStatus2[0].count), 
        completed: Number(readingStatus3[0].count) 
    });
});

module.exports = router;
