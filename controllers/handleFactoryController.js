import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.find().select('-__v');

    if (!doc) return next(new AppError('Items not found', 404));

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

export const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let findParameter = {};

    if (req.params.slug) {
      findParameter['slug'] = req.params.slug;
    } else {
      findParameter['_id'] = req.params.id;
    }

    const doc = await Model.findOne(findParameter).select('-__v');

    if (!doc) return next(new AppError('Item not found', 404));

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(200).json({
      status: 'success',
      message: 'Document successfully created',
      data: doc,
    });
  });

export const updateOne = (Model, folderName) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findById(req.params.id);

    if (!data) return next(new AppError('No item found', 404));

    try {
      console.log('image',req.body.image,data.image)
      if (req.body.image && data.image) {
        const imagePath = path.join(
          __dirname,
          `../public/assets/${folderName}`,
          data.image
        );

        // await rimraf(imagePath);

        // For removing one image
        if (fs.existsSync(imagePath)) {
          await fs.promises.unlink(imagePath);
        }

        console.log('Image deleted');
      }
    } catch (err) {
      console.log('Error deleting the image');
      return next(new AppError('Internal error while deleting the image', 500));
    }

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

export const deleteOne = (Model, folderName = null) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError('Item not found', 404));

    try {
      if (doc.image) {
        const imagePath = path.join(
          __dirname,
          `../public/assets/${folderName}`,
          doc.image
        );

        // await rimraf(imagePath);
        if (fs.existsSync(imagePath)) {
          await fs.promises.unlink(imagePath);
        }
        console.log('Image deleted');
      }

      res.status(200).json({
        status: 'success',
        message: 'Deleted Successfully',
      });
    } catch (err) {
      console.log(err);
      return next(new AppError('Internal server error during deletion', 500));
    }
  });
