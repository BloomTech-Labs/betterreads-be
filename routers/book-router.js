const router = require('express').Router();


const books = require('../models/books');


router.get('/:bookId', (req, res) => {
    const bookId = req.params.bookId 
    books.findById(bookId)
      .then(book => {
        res.json(book);
      })
      .catch(err => res.status(500).json({message: 'book not found'}));
  });

router.post('/', (req, res) => {
    const book = req.body.book
    books.add(book)
      .then(book => {
        res.status(201).json(book);
      })
      .catch(err => res.status(500).json({message: 'book not added'}));
  });
  

module.exports = router;