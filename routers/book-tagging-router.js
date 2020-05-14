const router = require("express").Router();

const bookTagging = require("../models/book-tagging");

router.post("/:userBooksId", async (req, res) => {
    const userBooksId = req.params.userBooksId;
    if (req.body["tags"]) {
        const preSplitTags = req.body["tags"];
        if (preSplitTags) {
            const tags = preSplitTags.split(",");
            await tags.map(tag => {
                bookTagging.getAllTagsForBook(userBooksId)
                    .then(presentTags => {
                        if (presentTags.map(presentTag => presentTag.bookTagName == tag).includes(true)) {
                            res.status(400).json({ message: "a requested tag already exists for the requested book"     })
                        } else {
                            bookTagging.addTag(userBooksId, tag)
                            .then(() => res.status(201).json({ message: "tag(s) successfully added" }))
                            .catch(({ name, message, stack }) => res.status(400).json({ error: "error adding tags",     name, message, stack }))
                        };
                    });
            });   
        };
    } else { res.status(400).json({ "message": "no tags sent"}) }
});

router.get("/:userBooksId", (req, res) => {
    const userBooksId = req.params.userBooksId;
    return bookTagging.getAllTagsForBook(userBooksId)
        .then(tags => {
            if (tags.length > 0) {
                res.status(200).json({ tags })
            } else { 
                res.status(404).json({ message: "requested user book does not exist or no tags for book" })
            };
        })
        .catch(({ name, message, stack }) => res.status(400).json({ error: "error retrieving tags", nmae, message, stack }));
});

router.get("/user/:userId", (req, res) => {
    const userId = req.params.userId;
    
    return bookTagging.getAllTagsForUser(userId)
        .then(tags => {
            if (tags.length > 0) {
                res.status(200).json({ tags });
            } else { res.status(404).json({ message: "user not found or tags do not exist for user" }) }
        })
        .catch(({ name, message, stack }) => res.status(400).json({ error: "error retrieving tags for the requested user", name, message, stack }));
});

router.put("/:tagId", (req, res) => {
    const tagId = req.params.tagId;
    const newTag = req.body.newTag;
    
    bookTagging.getTag(tagId)
        .then(tags => {
            if(tags.map(tag => tag.bookTagName == newTag).includes(true)) {
                res.status(400).json({ message: "requested updated tag already exists on requested book" })
            } else if(tags.length < 1) { 
                res.status(404).json({ message: "requested tag not found" }) 
            }
            
            bookTagging.editTag(tagId, newTag)
                .then(() => res.status(201).json({ message: "tag updated successfully" }))
                .catch(({ name, message, stack }) => res.status(400).json({ error: "be sure to send an existing tagId and a newTag that doesn't already exist", name, message, stack }));
        })
        .catch(({ name, message, stack }) => res.status(404).json({ error: "cannot find requested tag", name, message, stack }));
});

router.delete("/:tagId", (req, res) => {
    const tagId = req.params.tagId;
    
    bookTagging.getTag(tagId)
        .then(tag => {
            if(tag.length > 0) {
                bookTagging.deleteTag(tagId)
                    .then(() => res.status(200).json({ message: "tag deleted" }))
                    .catch(({ name, message, stack }) => res.status(500).json({ error: "could not delete tag", name, message, stack }));
            } else { res.status(404).json({ message: "requested tag does not exist" }) }
        })
        .catch(({ name, message, stack }) => res.status(500).json({ error: "could not delete tag", name, message, stack }));
});

module.exports = router;