const FinancialRecord = require("../models/FinancialRecord");
const AppError = require("../utils/appError");
const { sendSuccess } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const buildRecordFilter = (query) => {
  const filter = { isDeleted: false };

  // Keep the filter builder explicit so each query parameter stays easy to reason about.
  if (query.type) {
    filter.type = query.type;
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.search) {
    filter.notes = { $regex: query.search, $options: "i" };
  }

  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) {
      filter.date.$gte = query.startDate;
    }
    if (query.endDate) {
      filter.date.$lte = query.endDate;
    }
  }

  return filter;
};

const createRecord = asyncHandler(async (req, res) => {
  const record = await FinancialRecord.create({
    ...req.body,
    createdBy: req.user._id,
  });

  return sendSuccess(res, record, "Financial record created", 201);
});

const listRecords = asyncHandler(async (req, res) => {
  const query = req.query;
  const filter = buildRecordFilter(query);

  // Pagination and sorting are calculated server-side so the frontend can stay simple.
  const page = query.page;
  const limit = query.limit;
  const sortOrderValue = query.sortOrder === "asc" ? 1 : -1;
  const sort = { [query.sortBy]: sortOrderValue };

  const [records, total] = await Promise.all([
    FinancialRecord.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("createdBy", "name email role"),
    FinancialRecord.countDocuments(filter),
  ]);

  return sendSuccess(
    res,
    {
      records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        type: query.type || null,
        category: query.category || null,
        startDate: query.startDate || null,
        endDate: query.endDate || null,
        search: query.search || null,
      },
    },
    "Financial records fetched successfully"
  );
});

const getRecordById = asyncHandler(async (req, res) => {
  const record = await FinancialRecord.findOne({
    _id: req.params.id,
    isDeleted: false,
  }).populate("createdBy", "name email role");

  if (!record) {
    throw new AppError("Financial record not found", 404);
  }

  return sendSuccess(res, record, "Financial record fetched successfully");
});

const updateRecord = asyncHandler(async (req, res) => {
  const record = await FinancialRecord.findOneAndUpdate(
    {
      _id: req.params.id,
      isDeleted: false,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!record) {
    throw new AppError("Financial record not found", 404);
  }

  return sendSuccess(res, record, "Financial record updated successfully");
});

const deleteRecord = asyncHandler(async (req, res) => {
  const record = await FinancialRecord.findOneAndUpdate(
    {
      _id: req.params.id,
      isDeleted: false,
    },
    { isDeleted: true },
    { new: true }
  );

  if (!record) {
    throw new AppError("Financial record not found", 404);
  }

  return sendSuccess(res, { id: record._id }, "Financial record deleted successfully");
});

module.exports = {
  createRecord,
  listRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
