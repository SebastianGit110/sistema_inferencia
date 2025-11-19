import express from 'express';
import { getUsers, getUserById, updateUserRole,  updateUser, deleteUser,createUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.put('/:id/rol', updateUserRole);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);
router.get('/:id', getUserById);
router.post('/', createUser);

export default router;
