import { catchAsync } from '../../utils/catchAsync.js';
import AppError from '../../utils/appError.js';
import APIFeatures from '../../utils/apiFeatures.js';
// import { model } from 'mongoose';

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('no document found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: null,
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('no doc found!', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const getOne = (Model, PopOPtions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (PopOPtions) query = query.populate(PopOPtions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('no doc found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //to allow nested reviews on tour //hack//
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    //
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;


    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

  
