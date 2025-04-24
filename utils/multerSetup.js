import multer from 'multer';
import sharp from 'sharp';
import AppError from './appError.js';
import catchAsync from './catchAsync.js';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only image', false));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadPhoto = upload.single('image');

export const resizePhoto = (folder) =>
  catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `blog-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/assets/${folder}/${req.file.filename}`);

    req.body.image = req.file.filename;

    next();
  });
