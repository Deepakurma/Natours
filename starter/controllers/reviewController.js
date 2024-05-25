import Review from '../../model/reviewModel.js';
// import { catchAsync } from '../../utils/catchAsync.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from '../controllers/handlerFactory.js';

export const getAllReviews = getAll(Review);

export const setTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

export const createReview = createOne(Review);

export const deleteReview = deleteOne(Review);

export const updateReview = updateOne(Review);

export const getReview = getOne(Review);
