import React, { useEffect, useState } from 'react';
import { getActiveLoans, createLoan, returnLoan } from '../api/loanApi';

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [newLoan, setNewLoan] = useState({ userId: '', bookId: '', loanDate: '', returnDate: '' });

  useEffect(() => {
    async function fetchLoans() {
      const response = await getActiveLoans();
      setLoans(response);
    }
    fetchLoans();
  }, []);

  const handleCreateLoan = async () => {
    const createdLoan = await createLoan(newLoan);
    setLoans([...loans, createdLoan]);
  };

  return (
    <div>
      <h1>Gestión de Préstamos</h1>
      <ul>
        {loans.map((loan) => (
          <li key={loan.id}>{`Préstamo de ${loan.user.name} - ${loan.book.title}`}</li>
        ))}
      </ul>
      <form onSubmit={handleCreateLoan}>
        <input
          type="text"
          placeholder="ID Usuario"
          value={newLoan.userId}
          onChange={(e) => setNewLoan({ ...newLoan, userId: e.target.value })}
        />
        <input
          type="text"
          placeholder="ID Libro"
          value={newLoan.bookId}
          onChange={(e) => setNewLoan({ ...newLoan, bookId: e.target.value })}
        />
        <button type="submit">Registrar Préstamo</button>
      </form>
    </div>
  );
};

export default LoansPage;
