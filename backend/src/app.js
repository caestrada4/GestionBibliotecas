const express = require('express');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');
const soap = require('soap');
const { soapService, wsdl } = require('./services/loanService');

const app = express();
app.use(bodyParser.json());

// Rutas REST
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);

// Servicio SOAP
app.listen(process.env.SOAP_PORT, () => {
  console.log(`SOAP Service running on http://localhost:${process.env.SOAP_PORT}`);
  soap.listen(app, '/loanService', soapService, wsdl);
});

app.listen(3000, () => console.log('REST API running on http://localhost:3000'));
