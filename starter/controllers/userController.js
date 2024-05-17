import { user } from '../../model/userModel.js';
import AppError from '../../utils/appError.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const getAllUsers = catchAsync(async(req, res) => {
  const allUsers = await user.find();
  res.status(500).json({
    status: 'error',
    message: 'invalid user',
    users : allUsers
  });
});

export const getUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'invalid user',
  });
};

export const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'invalid user',
  });
};

export const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'invalid user',
  });
};

export const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'invalid user',
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


export const deleteMe = catchAsync( async (req, res , next) => {
   await user.findByIdAndUpdate(req.user.id, {active: false});

   res.status(204).json({
    status: 'success',
    data: null
  });
})