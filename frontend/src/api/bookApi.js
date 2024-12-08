import axios from 'axios';

const API_URL = 'http://localhost:3000/api/books';

export const getBooks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createBook = async (book) => {
  const response = await axios.post(API_URL, book);
  return response.data;
};

export const updateBook = async (id, book) => {
  const response = await axios.put(`${API_URL}/${id}`, book);
  return response.data;
};
