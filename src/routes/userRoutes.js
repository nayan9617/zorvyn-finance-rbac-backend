const express = require("express");
const { createUser, listUsers, updateUser } = require("../controllers/userController");
const validate = require("../middleware/validate");
const authorize = require("../middleware/authorize");
const { protect } = require("../middleware/auth");
const { ROLES } = require("../constants/roles");
const { createUserSchema, updateUserSchema } = require("../validators/userValidators");
const { idParamSchema } = require("../validators/recordValidators");

const router = express.Router();

router.use(protect, authorize(ROLES.ADMIN));

router.post("/", validate(createUserSchema), createUser);
router.get("/", listUsers);
router.patch("/:id", validate(idParamSchema, "params"), validate(updateUserSchema), updateUser);

module.exports = router;
