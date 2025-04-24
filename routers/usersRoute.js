import express from 'express';

import authController from '../controllers/authController.js';
import userController from '../controllers/usersController.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.get('/verify/:verifyToken', authController.verifyUserEmail);

router.use(authController.protect);

// user routes
router
  .route('/user/:id')
  .get(userController.getMe)
  .patch(userController.updateMe);

router.post('/user/forget-password', authController.forgetUserPassword);

router.patch(
  '/user/reset-forget-password/:resetToken',
  authController.resetUserPassword
);

router.patch('/me/delete/:id', userController.deleteMe);

// Admin routes
router.use(authController.restrictTo('admin'));
router.get('/', userController.getAllUsers);
router.get('/get-user', userController.getUser);
router.patch('/update-user-by-admin/:id', userController.patchUser);
router.patch('/ban-user-by-admin', userController.banUser);

export default router;
