import express from 'express';
import {
  getAllTours,
  getTours,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistance,
} from '../controllers/tourController.js';
import { aliasTopTours } from '../controllers/tourController.js';
import { protect } from '../controllers/authControllers.js';
import { restrictTo } from '../controllers/authControllers.js';
import reviewRouter from '../routes/reviewRoutes.js';

const tourRouter = express.Router();

// tourRouter
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), createReview);

tourRouter.use('/:tourId/reviews', reviewRouter);

// tourRouter.param('id', checkId);
tourRouter.route('/tour-stats').get(getTourStats);

tourRouter
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

tourRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours);

tourRouter
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

tourRouter
  .route('/:id')
  .get(getTours)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(deleteTour);

tourRouter.route('/tours-within/:distance/center/:latlng/unit/:unit').get(getToursWithin)
tourRouter.route('/distances/:latlng/unit/:unit').get(getDistance);

export default tourRouter;
