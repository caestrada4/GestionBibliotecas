// Habilitar modo de depuración para node-soap
process.env.NODE_DEBUG = 'soap';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');
const authRoutes = require('./routes/authRoutes');
const soap = require('soap');
const { loanService, wsdl } = require('./services/loanService');
const { verifySOAPRequest, globalErrorHandler } = require('./middlewares/authMiddleware');
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

// Middleware para procesar JSON y solicitudes SOAP
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/xml' })); // Manejo de solicitudes SOAP

// Middleware de autenticación para SOAP y REST
app.use(verifySOAPRequest);

// Rutas REST
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/auth', authRoutes);

// Logs para depurar solicitudes entrantes
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  console.log(`Headers: ${JSON.stringify(req.headers)}`);
  if (req.body) {
    console.log(`Body: ${req.body}`);
  }
  next();
});

// Servicio SOAP sobre el mismo puerto
// Servicio SOAP sobre el mismo puerto
// Inicialización del servicio SOAP
soap.listen(app, '/loanService', loanService, wsdl, (err) => {
  if (err) {
    console.error('Error al inicializar el servicio SOAP:', err);
  } else {
    console.log('Servicio SOAP inicializado correctamente en /loanService');
  }
});



// Endpoint WSDL para SOAP
app.get('/loanService?wsdl', (req, res) => {
  console.log('Solicitud WSDL recibida');
  res.type('application/xml');
  res.send(wsdl);
});

// Inicia el servidor en el puerto compartido
const port = process.env.REST_PORT || 3000;
app.listen(port, () => {
  console.log(`REST API and SOAP Service running on http://localhost:${port}`);
});

// Manejo de errores global para SOAP y REST
app.use(globalErrorHandler);

// Logs finales para cualquier solicitud no manejada
app.use((req, res, next) => {
  console.log(`Solicitud no manejada: ${req.method} ${req.url}`);
  next();
});

module.exports = app;
