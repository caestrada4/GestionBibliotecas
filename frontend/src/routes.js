import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import BooksPage from './pages/BooksPage';
import UsersPage from './pages/UsersPage';
import LoansPage from './pages/LoansPage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Navbar';

const Routes = () => (
  <Router>
    <Navbar />
    <Switch>
      <Route exact path="/books" component={BooksPage} />
      <Route exact path="/users" component={UsersPage} />
      <Route exact path="/loans" component={LoansPage} />
      <Route exact path="/dashboard" component={DashboardPage} />
    </Switch>
  </Router>
);

export default Routes;
