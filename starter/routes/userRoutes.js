import express from 'express';
import {
  getAllUsers,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} from '../controllers/userController.js';
import {
  forgotPassword,
  login,
  resetPassword,
  restrictTo,
  signup,
} from '../controllers/authControllers.js';
import { protect } from '../controllers/authControllers.js';

const userRouter = express.Router();
userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/forgotpassword', forgotPassword);
userRouter.patch('/resetpassword/:token', resetPassword);
userRouter.get('/me', protect, getMe, getUsers);

//
userRouter.use(protect);
userRouter.patch('/updateMe', updateMe);
userRouter.delete('/deleteMe', deleteMe);
userRouter.route('/').get(getAllUsers).post(createUser);

//
userRouter.use(restrictTo('admin', 'lead-guide'));
userRouter.route('/:id').get(getUsers).patch(updateUser).delete(deleteUser);

export default userRouter;
