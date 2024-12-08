import React from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);

  // Si el usuario no está autenticado, redirige al login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si está autenticado, renderiza el componente hijo
  return children;
};

export default PrivateRoute;
