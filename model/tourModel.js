import mongoose from "mongoose";
// import { defaultMaxListeners } from "nodemailer/lib/xoauth2";
import slugify from "slugify";
// import validator from "validator";
// import { user } from "./userModel.js";

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour name must be provided"],
      unique: true,
      trim: true,
      maxlength: [40, "The maximum length is needed"],
      minlength: [10, "The minimum length is needed"],
      validate: {
        validator: function (val) {
          return /^[a-zA-Z\s]+$/.test(val); // regex for alpha characters and spaces
        },
        message: "Enter name with appropriate alpha characters",
      },
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour duration must be provided"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour group size must be provided"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour difficulty must be provided"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "A tour difficulty must be provided",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "The rate shluld be above 1"],
      max: [5, "The rate should be below 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour price must be provided"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        //this is only used to point to the cureent document
        validator: function (val) {
          return val < this.price;
        },
        message:
          "please check the price ({VALUE}) before offering the discount",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour summary must be provided"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A cover must have an image"],
    },
    images: [String],
    createdAT: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: { type: String, default: "Point", enum: ["Point"] },

        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: "user" }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//schema middleware
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
//virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

// document middleware "runs before save() and crearte() command"
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre("save", async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await user.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.post('save',function(doc,next){

// })

//query middleware
// tourSchema.pre("find", function (next)
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

//this post hook is used to execute after cmpletion of document
tourSchema.post(/^find/, function (docs, next) {
  console.log(Date.now() - this.start);
  next();
});

//aggregation middleware
// tourSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v ",
  });
  next();
});

tourSchema.index({ price: 1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation : '2dsphere'})

export const Tour = mongoose.model("Tour", tourSchema);
