import express from 'express';
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  setTourUserId,
  updateReview,
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../controllers/authControllers.js';

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(protect);
reviewRouter.route('/').get(getAllReviews).post(restrictTo('user','admin'),setTourUserId, createReview);
reviewRouter
  .route('/:id')
  .delete(restrictTo('user','admin'),deleteReview)
  .patch(restrictTo('user','admin'),updateReview)
  .get(getReview);

export default reviewRouter;
