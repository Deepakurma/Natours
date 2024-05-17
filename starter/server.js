import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

// Load environment variables from config.env file
dotenv.config({ path: './config.env' });

// Set environment to development
process.env.NODE_ENV = 'development';

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught exception');
  console.log(err.name, err.message);
  process.exit(1);
});

// MongoDB connection
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1); // Exit the application if MongoDB connection fails
  });

// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
console.log(process.env.NODE_ENV);

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection');
  // console.log(err.name, err.message);/
  server.close(() => {
    process.exit(1);
  });
});
