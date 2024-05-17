import express from 'express';
import {
  getAllUsers,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} from '../controllers/userController.js';
import {
  forgotPassword,
  login,
  resetPassword,
  restrictTour,
  signup,
} from '../controllers/authControllers.js';
import { protect } from '../controllers/authControllers.js';

const userRouter = express.Router();
userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/forgotpassword', forgotPassword);
userRouter.patch('/resetpassword/:token', resetPassword);

//
userRouter.patch('/updateMe',protect,updateMe);
userRouter.delete('/deleteMe',protect,deleteMe);
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter
  .route('/:id')
  .get(getUsers)
  .patch(updateUser)
  .delete(protect, restrictTour('admin', 'lead-guide'), deleteUser);

export default userRouter;
