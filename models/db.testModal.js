import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync.js';
import axios from 'axios';
import AppError from '../utils/appError.js';

const testSchema = new mongoose.Schema(
  {
    HighBP: { type: Boolean, default: false },
    HighChol: { type: Boolean, default: false },
    stroke: { type: Boolean, default: false },
    heartDiseaseOrAttack: { type: Boolean, default: false },
    physicalActivity: { type: Boolean, default: false },
    HvyAlcoholConsump: { type: Boolean, default: false },
    GenHlth: { type: Boolean, default: false },
    MentalHealth: { type: Boolean, default: false },
    physicalHealth: { type: Number, default: 0 },
    diffWalk: { type: Boolean, default: false },
    Age: { type: Number, default: 10 },
    Income: { type: Number, default: 2 },
    BMI: { type: Number, default: 0 },
    predictionData: { type: Number, default: 50 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Test = mongoose.model('Test', testSchema);
export default Test;

export const createTest = catchAsync(async (req, res, next) => {
  try {
    const cleanedData = {};
    Object.keys(req.body).forEach((key) => {
      cleanedData[key] = !isNaN(req.body[key])
        ? Number(req.body[key])
        : req.body[key];
    });

    const apiPrediction = await axios.post(
      process.env.CORE_ROUTE + '/predict',
      cleanedData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (apiPrediction.statusText !== 'OK') {
      return next(new AppError('Error evaluating results', 404));
    }

    const chances = Math.round(apiPrediction.data.probability * 100);
    const predictionResult = `You have ${chances}% chances of having diabetes`;

    await Test.create({
      ...req.body,
      physicalHealth: req.body.PhysHlth,
      MentalHealth: req.body.MentHlth,
      Income: req.body.Income,
      predictionData: chances,
      user: req.user._id,
    });

    res.status(200).json({
      status: 'success',
      message: predictionResult,
    });
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err.message,
    });
  }
});

export const getAverageTestData = catchAsync(async (req, res, next) => {
  const user = req.user;
  const testsAverage = await Test.aggregate([
    {
      $match: { user: user._id },
    },
    {
      $group: {
        _id: null,
        averagePhysicalHealth: { $avg: '$physicalHealth' },
        averageIncome: { $avg: '$Income' },
        averageBMI: { $avg: '$BMI' },
        averagePedication: { $avg: '$predictionData' },
      },
    },
    {
      $project: { _id: 0 },
    },
  ]);

  if (!testsAverage) {
    res.status(200).json({
      status: 'success',
      message: 'Please make a test request health!',
    });
  }

  res.status(200).json({
    status: 'success',
    data: testsAverage,
  });
});

export const getAllTestData = catchAsync(async (req, res, next) => {
  const user = req.user;
  const allTests = await Test.find({ user: user._id });

  res.status(200).json({
    status: 'success',
    data: allTests,
  });
});

export const getTest = catchAsync(async (req, res, next) => {
  const test = await Test.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: test,
  });
});

export const deleteTestData = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const del = await Test.findOneAndDelete({ _id: req.body.reportID });

  if (!del) {
    return next(new AppError('Error Deleting Test!', 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'Test deleted successfully!',
  });
});
