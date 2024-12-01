const express = require('express');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/bookRoutes'); // Asegúrate de que esto es correcto
const userRoutes = require('./routes/userRoutes'); // Asegúrate de que esto es correcto
const loanRoutes = require('./routes/loanRoutes'); // Asegúrate de que esto es correcto
const soap = require('soap');
const { loanService, wsdl } = require('./services/loanService');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

// Rutas REST
app.use('/api/books', bookRoutes); // Aquí usa correctamente las rutas
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);

// Servicio SOAP
const soapPort = process.env.SOAP_PORT || 8000;
soap.listen(app, '/loanService', loanService, wsdl, () => {
  console.log(`SOAP Service running on http://localhost:${soapPort}/loanService?wsdl`);
});

// Inicia el servidor REST
const restPort = process.env.REST_PORT || 3000;
app.listen(restPort, () => {
  console.log(`REST API running on http://localhost:${restPort}`);
});
