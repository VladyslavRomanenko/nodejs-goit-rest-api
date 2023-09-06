const { controllerWrapper } = require("../decorators");
const { HttpError } = require("../helpers");
const Contact = require("../models/Contact");
const addSchema = require("../schemas/contacts");

const getAllContacts = async (req, res, next) => {
  const { id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const data = await Contact.find({ owner })
    .skip(skip)
    .limit(limit)
    .populate("owner", "email");
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
  const { id: owner } = req.user;
  const data = await Contact.create({ ...req.body, owner });
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
