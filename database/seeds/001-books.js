
exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('books').truncate()
        .then(function () {
        // Inserts seed entries
        return knex('books').insert([
            {
                id: 1,
                googleId: "smitwicshas123456",
                title: "The Best Test",
                author: "Sir Biglow",
                publisher:"BetterReadsBackEnd",
                publishDate:"2/21/2020",
                description: "This is a book for testing",
                isbn10: "1234567891",
                isbn13:"1234567891234",
                pageCount:500,
                categories:"TestBook",
                thumbnail:"testIMG",
                smallThumbnail:"smallTestImg",
                language: "english",
                webRenderLink: "testLink",
                textSnippet: "testSnippet",
                isEbook: false
            }
        ]);
    });
};
