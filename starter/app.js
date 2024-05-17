import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

import tourRouter from './routes/tourRoutes.js';
import { fileURLToPath } from 'url';
import userRouter from './routes/userRoutes.js';
import { dirname } from 'path';
import AppError from '../utils/appError.js';
import { error } from './controllers/errorControllers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

//security sets http headers
app.use(helmet());

//development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//limits the number of requests
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many requests, try after an hour!',
});
app.use('/api', limiter);

//body parser for reading data from req.body----------------------------------------------------------------
app.use(express.json({ limit: '10kb' }));

//data satitization against nosql query injection
app.use(ExpressMongoSanitize());

//data satitization against xss
app.use(xss());

//prevent parameter polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuality',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//serving static files
app.use(express.static(`${__dirname}/public`));

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//routes----------------------------------------------------------------

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl}`, 404));
});

app.use(error);

//server----------------------------------------------------------------

export default app;
