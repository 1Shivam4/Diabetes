import dotenv from 'dotenv';
dotenv.config({ path: 'config.env' });

import mongoose from 'mongoose';
import app from './app.js';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION: Shutting Down');
  console.log(err);
  process.exit(1);
});

// const db = process.env.DATABASE.replace(
//   '<db_password>',
//   process.env.DATABASE_PASSWORD
// );

const db = process.env.DATABASE_LOCAL;

mongoose.connect(db).then(() => {
  console.log('DB connection successfully');
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Listening to the port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLE REJECTION : Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
