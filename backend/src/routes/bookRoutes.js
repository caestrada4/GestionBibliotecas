const express = require("express");
const router = express.Router();
const Book = require("../models/book");

router.get("/", async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
});

router.post("/", async (req, res) => {
  const newBook = await Book.create(req.body);
  res.json(newBook);
});

module.exports = router;
