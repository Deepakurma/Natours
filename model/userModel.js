import mongoose from "mongoose";
import validator from "validator";
// import bcrypt from "bcryptjs";
import crypto from "crypto";
import { type } from "os";

const userSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: [true, "name is required"],
  },
  email: {
    type: "string",
    required: [true, "email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "enter a proper email address"],
  },
  photo: String,
  role: {
    type: "string",
    enum: ["user", "guide", "admin", "lead-guide"],
    default: "user",
  },
  password: {
    type: "string",
    required: [true, "password is required"],
    minlength: 8,
    select: false,
  },
  passwordConfirmation: {
    type: "string",
    required: [true, "password confirmation is required"],
    select: false,
    validate: {
      validator: function (value) {
        // console.log("this.password:", this.password);
        // console.log("value:", value);
        return value === this.password;
      },
      message: "Passwords do not match",
    },
  },
  passwordChanged: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: "boolean",
    default: true,
    select: false,
  },
});

// userSchema.pre("save", async function (next) {
//   //only run this if password is modified
//   if (this.isModified("password")) {
//     return next();
//   }

//   //hash the password
//   this.password = await bcrypt.hash(this.password, 12);

//   //delete passwordconfirmation
//   this.passwordConfirmation = undefined;
//   next();
// });

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  if (candidatePassword === userPassword) {
    return true;
  } else {
    return false;
  }
};

userSchema.methods.changePassword = async function (JWTTimesstamp) {
  if (this.passwordChanged) {
    const changedTimestamp = parseInt(this.passwordChanged.getTime() / 1000);
  }

  return false;
};
// ) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };

userSchema.methods.createPasswordResetToken = function () {
  // Generate a random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the reset token
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // console.log({ resetToken }, hashedToken);
  console.log(resetToken);
  console.log(hashedToken);
  // console.log(typeof resetToken)

  // Set the hashed token and expiration time in the user document
  this.passwordResetToken = hashedToken;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Return the unhashed reset token
  return resetToken;
};

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

export const user = mongoose.model("user", userSchema);
