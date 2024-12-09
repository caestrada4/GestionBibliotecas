const express = require('express');
const {
  getAllUsers,
  createUser,
  updateUser,
  getUserById,
  assignRole,
  suspendUser,
  unsuspendUser,
} = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rutas
router.get('/', verifyToken, verifyRole(['admin']), getAllUsers);
router.get('/:id', verifyToken, verifyRole(['admin', 'librarian']), getUserById);
router.post('/', verifyToken, verifyRole(['admin']), createUser);
router.put('/:id', verifyToken, verifyRole(['admin']), updateUser);
router.put('/:id/role', verifyToken, verifyRole(['admin']), assignRole);
router.put('/:id/suspend', verifyToken, verifyRole(['admin']), suspendUser);
router.put('/:id/unsuspend', verifyToken, verifyRole(['admin']), unsuspendUser);


module.exports = router;
