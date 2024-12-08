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
      {/* Validación para asegurar que Navbar y rutas están funcionando */}
      {Navbar ? <Navbar /> : <div>Error: Navbar no encontrado</div>}
      <Routes>
        <Route
          path="/"
          element={DashboardPage ? <DashboardPage /> : <div>Error: DashboardPage no encontrado</div>}
        />
        <Route
          path="/books"
          element={BooksPage ? <BooksPage /> : <div>Error: BooksPage no encontrado</div>}
        />
        <Route
          path="/users"
          element={UsersPage ? <UsersPage /> : <div>Error: UsersPage no encontrado</div>}
        />
        <Route
          path="/loans"
          element={LoansPage ? <LoansPage /> : <div>Error: LoansPage no encontrado</div>}
        />
      </Routes>
    </div>
  );
}

export default App;
