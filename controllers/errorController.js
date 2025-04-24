import AppError from '../utils/appError.js';

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 404);
};

// Also used regular expressions
const handleDuplicateErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/);

  const handleJwtError = () => new AppError('Invalid token: please log again');

  const message = `Duplicate field value ${value}. Please enter some other value`;
  return new AppError(message, 400);
};

const handleJwtExpiredError = () =>
  new AppError('Your token has expired please login again', 401);

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  // APIs
  if (req.originalUrl.startsWith('/api')) {
    return res.status(
      res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
      })
    );
  }
  // B) RENDERED WEBSITE
  
  console.error('ERROR 💥💥', err);

  return res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });

};

const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(
        res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
        })
      );
    }

    return res.status(500).json({
      status: 'error',
      message: 'Something wend wrong',
    });
  }

  if (err.isOperational) {
    return res
      .status(err.statusCode)
      .render('error', { title: 'something went wrong', msg: err.message });
  }

  return res.status(err.statusCode).render('error', {
    title: 'something went wrong',
    msg: 'Please try again later',
  });
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.keyValue.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJwtError();
    if (error.name === 'TokenExpiredError') error = handleJwtExpiredError();
    sendErrorProd(err, res);
  }
};
