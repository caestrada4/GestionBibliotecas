const Book = require('../models/book');

exports.getAllBooks = async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
};

exports.getBookById = async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.json(book || { message: 'Book not found' });
};

exports.createBook = async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json(book);
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const updated = await Book.update(req.body, { where: { id } });
  res.json(updated);
};
