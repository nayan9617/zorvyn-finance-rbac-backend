const express = require("express");
const { overview, trends, recent } = require("../controllers/summaryController");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { ROLES } = require("../constants/roles");
const { trendQuerySchema, recentQuerySchema } = require("../validators/summaryValidators");

const router = express.Router();

router.use(protect, authorize(ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER));

router.get("/overview", overview);
router.get("/trends", validate(trendQuerySchema, "query"), trends);
router.get("/recent", validate(recentQuerySchema, "query"), recent);

module.exports = router;
