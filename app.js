import dotenv from 'dotenv';
dotenv.config({ path: 'config.env' });

import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import usersRoutes from './routers/usersRoute.js';
import reportRoutes from './routers/reportsRoute.js';
import globalErrorHandler from './controllers/errorController.js';
import cors from 'cors';
import AppError from './utils/appError.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(helmet());

const limiter = rateLimit({
  max: 300,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request form this IP, please  try again in an hour',
});

app.use('/api', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(mongoSanitize());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.reqestTime = new Date().toLocaleDateString();
  next();
});

// TODOS : compression, cors
app.use(cors());
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL, // Allow only your frontend
//     methods: 'GET, POST, PUT, DELETE',
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//   })
// );

app.use('/api/v1/user', usersRoutes);
app.use('/api/v1/test', reportRoutes);

app.all('*', (req, res, next) => {
  return next(new AppError(`Can't find the ${req.protocol} on this url`, 404));
});

app.use(globalErrorHandler);

export default app;
