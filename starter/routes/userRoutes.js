import express from 'express';
import {
  getAllUsers,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

const userRouter = express.Router();
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUsers).patch(updateUser).delete(deleteUser);

export default userRouter;
