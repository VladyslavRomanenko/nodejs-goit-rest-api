const Joi = require("joi");
const { HttpError, controllerWrapper } = require("../helpers");
const Contact = require("../models/Contact");

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const getAllContacts = async (req, res, next) => {
  const data = await Contact.find();
  res.json(data);
};

const getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findById(contactId);
    if (!contact) {
      throw HttpError(404, "Not Found");
    } else {
      res.json(contact);
    }
  } catch (error) {
    next(error);
  }
};

const addContactToList = async (req, res, next) => {
  const { error } = addSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const data = await Contact.create(req.body);
  res.status(201).json(data);
};

const changeContact = async (req, res, next) => {
  const { error } = addSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.json(contact);
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  if (favorite === undefined) {
    throw HttpError(400, "missing field favorite");
  }
  const contact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    {
      new: true,
    }
  );
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.json(contact);
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const removeContact = await Contact.findByIdAndDelete(contactId);
    if (!removeContact) {
      throw HttpError(404, "Not found");
    }
    res.json({ message: "contact deleted" }).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContact: controllerWrapper(getContact),
  getAllContacts: controllerWrapper(getAllContacts),
  addContactToList: controllerWrapper(addContactToList),
  changeContact: controllerWrapper(changeContact),
  deleteContact: controllerWrapper(deleteContact),
  updateStatusContact: controllerWrapper(updateStatusContact),
};
