const { Schema, model } = require("mongoose");
const { handleValidateError, runUpdateValidators } = require("./hooks");
const { emailRegexp } = require("../constants/user-constants");

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
      minlength: 6,
    },
    email: {
      type: String,
      required: [true, "Email is  required"],
      match: emailRegexp,
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    avatarUrl: String,
    token: String,
  },
  { versionKey: false }
);

userSchema.post("save", handleValidateError);
userSchema.pre("findOneAndUpdate", runUpdateValidators);
userSchema.post("findOneAndUpdate", handleValidateError);

const User = model("user", userSchema);

module.exports = User;
