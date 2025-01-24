const express = require('express');
const router = express.Router();
const { getLibraries, createLibrary, getLibraryById, updateLibrary, deleteLibrary } = require('../controllers/libraryController');

// Rutas para las librerías
router.get('/libraries', getLibraries); // Obtener todas las librerías
router.post('/libraries', createLibrary); // Crear una nueva librería
router.get('/libraries/:id', getLibraryById); // Obtener una librería por su ID
router.put('/libraries/:id', updateLibrary); // Actualizar una librería por su ID
router.delete('/libraries/:id', deleteLibrary); // Eliminar una librería por su ID

module.exports = router;
