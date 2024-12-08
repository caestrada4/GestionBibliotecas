import axios from 'axios';

const API_URL = 'http://localhost:3000/api/loans';

export const getActiveLoans = async () => {
  const response = await axios.get(`${API_URL}/active`);
  return response.data;
};

export const createLoan = async (loan) => {
  const response = await axios.post(API_URL, loan);
  return response.data;
};

export const returnLoan = async (id) => {
  const response = await axios.put(`${API_URL}/${id}/return`);
  return response.data;
};
