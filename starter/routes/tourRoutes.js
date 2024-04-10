import express from 'express';
import {
  getAllTours,
  getTours,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
} from '../controllers/tourController.js';
import { aliasTopTours } from '../controllers/tourController.js';
import { protect } from '../controllers/authControllers.js';

const tourRouter = express.Router();


// tourRouter.param('id', checkId);
tourRouter.route('/tour-stats').get(getTourStats);
tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);

tourRouter.route('/top-5-cheap').get(aliasTopTours,getAllTours);

tourRouter.route('/').get(protect,getAllTours).post(createTour);
tourRouter.route('/:id').get(getTours).patch(updateTour).delete(deleteTour);

export default tourRouter;

