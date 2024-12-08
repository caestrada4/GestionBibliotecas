const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importar CORS
const bookRoutes = require('./routes/bookRoutes'); 
const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');
const authRoutes = require('./routes/authRoutes');

const soap = require('soap');
const { loanService, wsdl } = require('./services/loanService');
require('dotenv').config();

const app = express();

// Configuración de CORS
app.use(
  cors({
    origin: "http://localhost:3001", // Dominio del frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware para procesar JSON
app.use(bodyParser.json());

// Rutas REST
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/auth', authRoutes);

// Servicio SOAP
const soapPort = process.env.REST_PORT || 3000;
soap.listen(app, '/loanService', loanService, wsdl, () => {
  console.log(`SOAP Service running on http://localhost:${soapPort}/loanService?wsdl`);
});

// Inicia el servidor REST
const restPort = process.env.REST_PORT || 3000;
app.listen(restPort, () => {
  console.log(`REST API running on http://localhost:${restPort}`);
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

module.exports = app;
