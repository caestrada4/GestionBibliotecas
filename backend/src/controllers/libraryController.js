const Library  = require('../models/library'); // Importar el modelo de librería

// Obtener todas las librerías
exports.getLibraries = async (req, res) => {
  try {
    const libraries = await Library.findAll(); // Obtiene todas las librerías
    res.json(libraries);
  } catch (error) {
    console.error('Error al obtener las librerías:', error);
    res.status(500).json({ message: 'Error al obtener las librerías' });
  }
};

// Crear una nueva librería
exports.createLibrary = async (req, res) => {
  const { name, address } = req.body;

  try {
    const newLibrary = await Library.create({ name, address }); // Crea una nueva librería
    res.status(201).json(newLibrary); // Devuelve la librería recién creada
  } catch (error) {
    console.error('Error al crear la librería:', error);
    res.status(500).json({ message: 'Error al crear la librería' });
  }
};

// Obtener una librería por su ID
exports.getLibraryById = async (req, res) => {
  const { id } = req.params;

  try {
    const library = await Library.findByPk(id); // Encuentra la librería por su ID
    if (!library) {
      return res.status(404).json({ message: 'Librería no encontrada' });
    }
    res.json(library); // Devuelve la librería encontrada
  } catch (error) {
    console.error('Error al obtener la librería:', error);
    res.status(500).json({ message: 'Error al obtener la librería' });
  }
};

// Actualizar una librería por su ID
exports.updateLibrary = async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;

  try {
    const library = await Library.findByPk(id);
    if (!library) {
      return res.status(404).json({ message: 'Librería no encontrada' });
    }

    library.name = name || library.name;
    library.address = address || library.address;

    await library.save(); // Guarda los cambios
    res.json(library); // Devuelve la librería actualizada
  } catch (error) {
    console.error('Error al actualizar la librería:', error);
    res.status(500).json({ message: 'Error al actualizar la librería' });
  }
};

// Eliminar una librería por su ID
exports.deleteLibrary = async (req, res) => {
  const { id } = req.params;

  try {
    const library = await Library.findByPk(id);
    if (!library) {
      return res.status(404).json({ message: 'Librería no encontrada' });
    }

    await library.destroy(); // Elimina la librería
    res.json({ message: 'Librería eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la librería:', error);
    res.status(500).json({ message: 'Error al eliminar la librería' });
  }
};
