const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware para verificar el token JWT (para solicitudes REST)


// Middleware para verificar el token JWT (para solicitudes REST)
exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token no proporcionado o inválido' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret'); // Asegúrate de usar una clave secreta segura

    // Adjuntar `library_id` al usuario para acceder a los datos correspondientes
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Agregar información del usuario y `library_id` al objeto `req.user`
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      library_id: user.library_id, // Asociar `library_id` al usuario
    };

    next(); // Continuar con el siguiente middleware o ruta
  } catch (error) {
    console.error('Error al verificar el token:', error.message);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};


// Middleware para verificar roles
// Middleware para verificar roles
exports.verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role; // El rol está en req.user después de verificar el token
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
      }
      next();
    } catch (error) {
      console.error('Error al verificar rol:', error.message);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
};


// Middleware opcional: Autenticación básica (sin token, para desarrollo)
exports.basicAuth = async (req, res, next) => {
  try {
    const { email, password } = req.headers;

    if (!email || !password) {
      return res.status(401).json({ message: 'Credenciales no proporcionadas' });
    }

    // Buscar el usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      userType: user.userType,
    };

    next();
  } catch (error) {
    console.error('Error en la autenticación básica:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Middleware para manejar solicitudes SOAP y REST
exports.verifySOAPRequest = (req, res, next) => {
  if (req.is('xml') || req.headers['content-type'] === 'text/xml') {
    try {
      // Verificar el token en el header para solicitudes SOAP
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('Token no proporcionado en solicitud SOAP');
        return res.status(401).send(`
          <soapenv:Envelope xmlns:soapenv="https://schemas.xmlsoap.org/soap/envelope/">
            <soapenv:Body>
              <soapenv:Fault>
                <faultcode>SOAP-ENV:Client</faultcode>
                <faultstring>Token no proporcionado o inválido para SOAP</faultstring>
              </soapenv:Fault>
            </soapenv:Body>
          </soapenv:Envelope>
        `);
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Andrew254195');
      req.user = decoded; // Agregar usuario decodificado a la solicitud
      return next();
    } catch (error) {
      console.error('Error al verificar token para SOAP:', error.message);
      return res.status(401).send(`
        <soapenv:Envelope xmlns:soapenv="https://schemas.xmlsoap.org/soap/envelope/">
          <soapenv:Body>
            <soapenv:Fault>
              <faultcode>SOAP-ENV:Client</faultcode>
              <faultstring>Token inválido o expirado para SOAP</faultstring>
            </soapenv:Fault>
          </soapenv:Body>
        </soapenv:Envelope>
      `);
    }
  }
  next();
};

// Manejo de errores global
exports.globalErrorHandler = (err, req, res, next) => {
  console.error('Error no manejado:', err.stack);
  if (req.is('xml') || req.headers['content-type'] === 'text/xml') {
    res.status(500).send(`
      <soapenv:Envelope xmlns:soapenv="https://schemas.xmlsoap.org/soap/envelope/">
        <soapenv:Body>
          <soapenv:Fault>
            <faultcode>SOAP-ENV:Server</faultcode>
            <faultstring>Error interno del servidor</faultstring>
          </soapenv:Fault>
        </soapenv:Body>
      </soapenv:Envelope>
    `);
  } else {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
// middleware/libraryAccessMiddleware.js

exports.verifyLibraryAccess = (req, res, next) => {
  // Obtener el library_id del usuario desde el objeto req.user, que fue establecido en el middleware verifyToken
  const userLibraryId = req.user.library_id;

  // Obtener el library_id de la consulta de la ruta (por ejemplo, de la URL como parámetro)
  const requestedLibraryId = req.query.library_id;

  // Comprobar si el usuario tiene acceso a la biblioteca solicitada
  if (userLibraryId !== requestedLibraryId) {
    return res.status(403).json({
      message: 'Acceso denegado: No tienes permiso para ver los usuarios de esta biblioteca.',
    });
  }

  // Si el usuario tiene permiso, continuar con la ejecución de la siguiente función de middleware o controlador
  next();
};
