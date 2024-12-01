const express = require('express');
const { getAllBooks, createBook, updateBook, getBookById } = require('../controllers/bookController');

const router = express.Router();

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id', updateBook);

module.exports = router;
