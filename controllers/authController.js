import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import crypto from 'crypto';

import User from '../models/db.usersModal.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { sendVerifyEmail, sendForgotPasswordMail } from '../utils/email.js';
//////////////////// USER AUTHORIZATION AND AUTHENTICATION ////////////////////

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 23 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production')
    cookieOptions.secure =
      req.secure || req.header('x-forwarded-proto') === 'https';

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword)
    return next(new AppError('All feilds are required ', 400));

  const user = await User.findOne({ email: email });

  if (user) {
    return next(new AppError('User already exists', 409));
  }

  const newUser = await User.create({ name, email, password, confirmPassword });

  // let verificationToken = newUser.createVerificationToken();
  // await newUser.save({ validateBeforeSave: false });

  // try {
  //   const sendVerificationLink = `${req.protocol}://${req.get(
  //     'host'
  //   )}/api/v1/user/verify/${verificationToken}`;

  //   await sendVerifyEmail(email, name, sendVerificationLink);
  // } catch (error) {
  //   verificationToken = undefined;
  //   await newUser.save({ validateBeforeSave: false });

  //   return next(new AppError('Error sending the email please try later'));
  // }

  // res.status(200).json({
  //   status: 'success',
  //   message: 'Welcome Aboard!' + name,
  // });
  createSendToken(newUser, 200, req, res);
});

export const verifyUserEmail = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.verifyToken) // Raw token from URL
    .digest('hex');

  console.log(hashedToken);

  const user = await User.findOne({ verificationToken: hashedToken });

  if (!user) return next(new AppError('Invalid or expired token', 400));
  user.isEmailVerified = true;
  user.verificationToken = undefined;
  user.confirmPassword = undefined;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Email verified. Please login to your account',
  });
});

export const login = catchAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) return next(new AppError('User Not found', 404));

    if (user?.banned)
      return next(new AppError('You are not allowed to use this', 401));

    if (!user?.isEmailVerified)
      return next(
        new AppError(
          'You have not verified yet!. Please verify your email',
          401
        )
      );

    if (!user || !(await user.correctPassword(password, user.password)))
      return next(new AppError('User email or password is incorrect', 404));

    createSendToken(user, 200, req, res);
  } catch (e) {
    next(new AppError('Something went wrong', 400));
  }
});

export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};

// this is not tested. Test it once the frontend is done
export const forgetUserPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('User not found! Please check your email.', 404));
  }

  const resetPasswordToken = user.forgetPassword();
  await user.save({ validateBeforeSave: false });

  try {
    const resetPasswordLink = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/user/reset-forget-password/${resetPasswordToken}`;

    await sendForgotPasswordMail(email, user.name, resetPasswordLink);
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new AppError('Error sending Email'));
  }
});

// this is also not tested. Test once frontend is done
export const resetUserPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.resetToken);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) next(new AppError('Invalid or expired token', 400));
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;

  await user.save();

  createSendToken(user, 200, req, res);
});

///////////////////////// Protected Sections and authoizations /////////////////

export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError('You are not logged in! Please login first.', 401)
    );

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentuser = await User.findById(decode.id).select(
    '-password -__v -role -isEmailVerified'
  );

  if (!currentuser)
    return next(
      new AppError('User belonging to this token does not exists', 401)
    );

  req.user = currentuser;
  res.locals.user = currentuser;

  next();
});

export const isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decode = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      const currentuser = await User.findById(decode.id);

      if (!currentuser) {
        return next();
      }
      res.locals.user = currentuser;
      return next();
    }
  } catch (e) {
    return next();
  }

  next();
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have the permission to perform this ', 403)
      );
    }

    next();
  };
};

const authController = {
  signup,
  login,
  logout,
  protect,
  isLoggedIn,
  restrictTo,
  verifyUserEmail,
  forgetUserPassword,
  resetUserPassword,
};

export default authController;
