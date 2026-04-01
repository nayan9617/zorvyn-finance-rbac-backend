const express = require("express");
const { login, me } = require("../controllers/authController");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const { loginSchema } = require("../validators/authValidators");

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.get("/me", protect, me);

module.exports = router;
