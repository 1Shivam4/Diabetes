import User from '../models/db.usersModal.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

/////////////// User Privilages /////////////////////
export const getMe = catchAsync(async (req, res, next) => {
  const me = await User.findById(req.params.id);

  if (!me) return next(new AppError('User not found', 404));

  res.status(200).json({
    status: 'success',
    data: me,
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  const me = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!me) return next(new AppError('User not found', 404));

  res.status(200).json({
    status: 'success',
    data: me,
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  const me = await User.findByIdAndUpdate(
    req.params.id,
    { active: false },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!me) return next(new AppError('User not found', 404));

  res.status(200).json({
    status: 'success',
    data: me,
  });
});

////////////////// Admin privilages ///////////////////////
export const createUser = (req, res, next) => {
  res.status(405).json({
    status: 'error',
    message:
      'This route is not defined please use signup page to register yourself.',
  });
};
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: users,
  });
});
export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    $or: [{ userHandle: req.body.userHandle }, { email: req.body.email }],
  });

  if (!user) return new AppError('User not found', 404);

  res.status(200).json({
    status: 'success',
    data: user,
  });
});
export const patchUser = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (status)
    return next(
      new AppError(
        'Permission not allowed to delete the user. Use delete page!',
        403
      )
    );

  const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updateUser) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'User has been updated',
  });
});
export const banUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    $or: [{ userHandle: req.body.userHandle }, { email: req.body.email }],
  });

  if (!user) return next(new AppError('User not found', 404));

  const id = user._id;
  const banned = { banned: true };
  await User.findByIdAndUpdate(id, banned, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'User is banned from using application',
  });
});


const userController = {
  getMe,
  updateMe,
  deleteMe,
  createUser,
  getAllUsers,
  getUser,
  patchUser,
  banUser,
};

export default userController;
