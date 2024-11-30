import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BooksPage from './pages/BooksPage';
import UsersPage from './pages/UsersPage';
import LoansPage from './pages/LoansPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/loans" element={<LoansPage />} />
      </Routes>
    </div>
  );
}

export default App;
