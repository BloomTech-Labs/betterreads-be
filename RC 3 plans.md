# book tagging
- tags crud endpoints
- tests
- table in the database with foreign key pointing to userbooks

# statistics
- make query endpoint for pages read, all three  reading statuses
- call seperately, but in order, all three reading  statuses and send back the data	
		const stats =  (userId, readingStatus) => {
		if userId 
		return db(userBooks)
			.count("id")
			.where({ userId, readingStatus })
		else 
		return db(userBooks)
			.count("id")
			.where({ readingStatus })
		}
router.get("/readingStats", async (req, res) => {
	const readingStatus1 = await db.stats(1);
	const readingStatus2 = await db.stats(2) ...;
	res.status(200).json({ readingStatus1,...} );
	});
router.get("/readingStats/:user", (req, res) =>? {
	const { userId } = req.body
	const readingStatus1 = db.stats({ userId, readingStatus: 1 })
	const readingStatus2 = db.stats({ userId, readingStatus: 2 })
	const readingStatus3 = db.stats({ userId, readingStatus: 3 })
	});