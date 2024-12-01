import React, { useEffect, useState } from 'react';
import { fetchLoans } from '../api/loanApi'; // Asegúrate de haber implementado esta API

function LoansPage() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const loadLoans = async () => {
      const data = await fetchLoans();
      setLoans(data);
    };
    loadLoans();
  }, []);

  return (
    <div>
      <h1>Gestión de Préstamos</h1>
      <ul>
        {loans.map((loan) => (
          <li key={loan.id}>
            Usuario: {loan.userId}, Libro: {loan.bookId}, Fecha de préstamo: {loan.loanDate}, Fecha de devolución: {loan.returnDate}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LoansPage;
