import { user } from '../../model/userModel.js';
import AppError from '../../utils/appError.js';
import { catchAsync } from '../../utils/catchAsync.js';
import {
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from '../controllers/handlerFactory.js';

export const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Please use another route this route is not defined!',
  });
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
    return newObj;
  });
};

export const updateMe = async (req, res, next) => {
  //create errror if user post password data
  if (req.body.password || req.body.passwordConfirmation) {
    return next(new AppError('this route is not for password update', 400));
  }

  //update user document
  const filterBody = filterObj(req.body, 'name', 'email');
  const updateUser = await user.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
};

export const deleteMe = catchAsync(async (req, res, next) => {
  await user.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

//
export const getAllUsers = getAll(user);

export const getUsers = getOne(user);

export const updateUser = updateOne(user);

export const deleteUser = deleteOne(user);
//
