router.post("/:userId/library/", (req, res) => {
	const userId = req.params.userId;
	const book = req.body.book;
	const status = req.body.readingStatus;
	if (book) {
		const title = book.title;
		Books.findBy({ title })
			.first()
			.then(bk => {
				if (bk == undefined) {
					Books.add(book)
						.then(book => {
							console.log(book);
							const userbookObj = {
								bookId: book.id,
								readingStatus: status,
								userId: userId
							};
							UserBooks.add(userbookObj)
								.then(added => {
									if (added == undefined) {
										res.status(400).json({
											message:
												"userbooks: please provide book"
										});
									} else {
										res.status(201).json(added);
									}
								})
								.catch(err => {
									res.status(500).json({
										message: "error in posting userbook"
									});
								});
						})
						.catch(err =>
							res.status(500).json({ message: "Book not added" })
						);
				} else {
					res.status(200).json(bk);
				}
			})
			.catch(err => {
				res.status(500).json({
					message: "Error, something went wrong"
				});
			});
	} else {
		res.status(400).json({ message: "Please provide a book" });
	}
});