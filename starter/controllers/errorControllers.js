import AppError from '../../utils/appError.js';

const handleCasterror = (err) => {
  const message = `invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateError = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  console.log(value);
  const message = `Duplicate , please an another value`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `invalid inputdata ${errors.join(',')}`;
  return new AppError(message, 400);
};

const handlejwterror = (err) => {
  new AppError('Invalid token', 401);
};

const handleTokenExpiredError = (err) => {
  new AppError('Token has expired', 401);
};

const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    // statusCode: err.statusCode
  });
};

const sendErrorPro = (err, req, res) => {
  // Operational error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or unknown error
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      error: err,
    });
  }
};

export const error = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCasterror(error);
    if (error.code === 1100) error = handleDuplicateError(error);
    if (error.name === 'ValidatorError') error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handlejwterror();
    if (error.name === 'TokenExpiredError')
      error = handleTokenExpiredError();

    sendErrorPro(error, req, res);
  }
  next();
};
