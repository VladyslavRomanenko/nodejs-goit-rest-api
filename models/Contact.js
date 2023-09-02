const { Schema, model } = require("mongoose");
const { handleValidateError } = require("./hooks");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

contactSchema.post("save", handleValidateError);

const Contact = model("contact", contactSchema);

module.exports = Contact;
