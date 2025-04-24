import express from 'express';
import {
  createTest,
  getAverageTestData,
  getAllTestData,
  deleteTestData,
  getTest,
} from '../models/db.testModal.js';
import authController from '../controllers/authController.js';

const router = express.Router();

router.use(authController.protect);
router.route('/').get(getAverageTestData).post(createTest);
router.get('/all', getAllTestData);
router.route('/:id').get(getTest).delete(deleteTestData);

export default router;
