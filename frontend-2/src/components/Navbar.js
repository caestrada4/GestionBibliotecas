import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ padding: "1rem", background: "#282c34", color: "white" }}>
      <ul style={{ display: "flex", listStyle: "none", margin: 0, padding: 0 }}>
        <li style={{ margin: "0 1rem" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            Inicio
          </Link>
        </li>
        <li style={{ margin: "0 1rem" }}>
          <Link to="/books" style={{ color: "white", textDecoration: "none" }}>
            Libros
          </Link>
        </li>
        <li style={{ margin: "0 1rem" }}>
          <Link to="/users" style={{ color: "white", textDecoration: "none" }}>
            Usuarios
          </Link>
        </li>
        <li style={{ margin: "0 1rem" }}>
          <Link to="/loans" style={{ color: "white", textDecoration: "none" }}>
            Préstamos
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
