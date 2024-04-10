import express from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tourRoutes.js';
import { fileURLToPath } from 'url';
import userRouter from './routes/userRoutes.js';
import { dirname } from 'path';
import AppError from '../utils/appError.js';
import { error } from './controllers/errorControllers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//middlewares----------------------------------------------------------------

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//routes----------------------------------------------------------------

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl}`,404));
});

app.use(error);

//server----------------------------------------------------------------

export default app;
