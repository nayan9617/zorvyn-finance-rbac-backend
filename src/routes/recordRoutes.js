const express = require("express");
const {
  createRecord,
  listRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { ROLES } = require("../constants/roles");
const {
  createRecordSchema,
  updateRecordSchema,
  listRecordQuerySchema,
  idParamSchema,
} = require("../validators/recordValidators");

const router = express.Router();

router.use(protect);

router.get("/", authorize(ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER), validate(listRecordQuerySchema, "query"), listRecords);
router.get("/:id", authorize(ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER), validate(idParamSchema, "params"), getRecordById);
router.post("/", authorize(ROLES.ADMIN), validate(createRecordSchema), createRecord);
router.patch("/:id", authorize(ROLES.ADMIN), validate(idParamSchema, "params"), validate(updateRecordSchema), updateRecord);
router.delete("/:id", authorize(ROLES.ADMIN), validate(idParamSchema, "params"), deleteRecord);

module.exports = router;
