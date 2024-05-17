import util from 'util';
import { user } from '../../model/userModel.js';
import AppError from '../../utils/appError.js';
import { catchAsync } from '../../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../../utils/email.js';
import crypto from 'crypto';

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await user.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    secure: true,
    httpOnly: true
  };
  if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      User: newUser,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if the email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide a valid email and password', 400));
  }

  // Check if user exists and password is correct
  const currentUser = await user.findOne({ email }).select('+password');

  if (
    !currentUser ||
    !(await currentUser.correctPassword(password, currentUser.password))
  ) {
    return next(new AppError('Incorrect password or email', 401));
  } else {
    // Generate JWT token
    const token = signToken(currentUser._id);

    // Send token in response
    res.status(200).json({
      status: 'success',
      token,
    });
  }
});

export const protect = catchAsync(async (req, res, next) => {
  //getting token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('you are not logged in'), 401);
  }

  //validate token
  // Promisify jwt.verify
  const verifyTokenAsync = util.promisify(jwt.verify);

  // Now you can use verifyTokenAsync as a promisified version of jwt.verify
  const decoded = await verifyTokenAsync(token, process.env.JWT_SECRET);
  console.log(decoded);
  console.log(decoded.id);

  //check if user still exists
  const freshUser = await user.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('no user found'), 401);
  }

  //check if user has changed password after token has been issued
  // if (freshUser.changePassword(decoded.iat)) {
  //   return next(new AppError('User has changed password', 401));
  // }

  // set req.user to the freshUser
  req.user = freshUser;

  next();
});

export const restrictTour = (...roles) => {
  return (req, res, next) => {
    //roles is an array
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission', 403));
    }
    console.log(req.user.role);
    next();
  };
};

// export const forgotPassword = catchAsync(async (req, res, next) => {
//   //get user based on posted email
//   const tempuser = await user.findOne({ email: req.user.email });
//   if (!tempuser) {
//     return next(new AppError('there is no user wiht email', 404));
//   }

//   const resetToken = user.createPasswordResetToken();
//   await user.save({ validateBeforeSave: false });
// });
export const forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on posted email
  const tempuser = await user.findOne({ email: req.body.email });
  if (!tempuser) {
    return next(new AppError('There is no user with that email', 404));
  }

  // Generate the reset token and save it to the user
  const resetedToken = tempuser.createPasswordResetToken();
  await tempuser.save({ validateBeforeSave: false });

  //send email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetedToken}`;

  const message = `forgot password reset it with patch wiht new password to ${resetURL} `;
  try {
    await sendEmail({
      email: req.body.email,
      subject: 'your password reset',
      message,
    });

    // Send response to client
    res.status(200).json({
      resetedToken,
      status: 'success',
      message: 'Reset token sent to email',
    });
  } catch (err) {
    tempuser.passwordResetToken = undefined;
    tempuser.passwordResetExpires = undefined;
    await tempuser.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email'), 500);
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // get user based on hashed token and token expiration date
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const tempUser = await user.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!tempUser) {
    return next(new AppError('Token invalid', 400));
  }

  // Update user's password and clear password reset token and expiration date
  tempUser.password = req.body.password;
  tempUser.passwordConfirmation = req.body.passwordConfirmation;
  tempUser.passwordResetToken = undefined;
  tempUser.passwordResetExpires = undefined;
  await tempUser.save();

  // Log the token (if needed)
  // console.log(token);

  // Send success response
  res.status(200).json({
    status: 'success',
    // token,
  });
});

