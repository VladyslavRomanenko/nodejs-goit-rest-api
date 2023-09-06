const express = require("express");
const controllers = require("../../controllers/contacts");
const router = express.Router();

const { isValidId, authenticate } = require("../../middlewares");

router.use(authenticate);

router.get("/", controllers.getAllContacts);

router.get("/:contactId", isValidId, controllers.getContact);

router.post("/", controllers.addContactToList);

router.put("/:contactId", isValidId, controllers.changeContact);

router.delete("/:contactId", isValidId, controllers.deleteContact);

router.patch(
  "/:contactId/favorite",
  isValidId,
  controllers.updateStatusContact
);

module.exports = router;
