import React, { useEffect, useState } from 'react';
import { fetchBooks } from '../api/bookApi';

function BooksPage() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const loadBooks = async () => {
      const data = await fetchBooks();
      setBooks(data);
    };
    loadBooks();
  }, []);

  return (
    <div>
      <h1>Gestión de Libros</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>{book.title} - {book.author}</li>
        ))}
      </ul>
    </div>
  );
}

export default BooksPage;
