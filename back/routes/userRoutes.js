import express from 'express';
import { getUsers, updateUserRole, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.put('/:id/rol', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
