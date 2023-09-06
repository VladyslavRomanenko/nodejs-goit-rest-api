const express = require("express");

const controllers = require("../../controllers/auth");

const { validateBody } = require("../../decorators");

const schemas = require("../../schemas/users");

const { authenticate } = require("../../middlewares");

const router = express.Router();

const signUpValidateMiddleware = validateBody(schemas.userSignUpSchema);
const signInValidateMiddleware = validateBody(schemas.userSignInSchema);

router.post("/register", signUpValidateMiddleware, controllers.signUp);
router.post("/login", signInValidateMiddleware, controllers.signIn);
router.get("/current", authenticate, controllers.getCurrent);
router.post("/logout", authenticate, controllers.logOut);

module.exports = router;
