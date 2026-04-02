const { sendSuccess } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const {
  getOverview,
  getRecentActivity,
  getMonthlyTrends,
  getWeeklyTrends,
} = require("../services/summaryService");

const overview = asyncHandler(async (req, res) => {
  const data = await getOverview();
  return sendSuccess(res, data, "Dashboard overview fetched successfully");
});

const trends = asyncHandler(async (req, res) => {
  const { mode, months, weeks } = req.query;

  // Weekly and monthly series are built by separate aggregation pipelines.
  const data = mode === "weekly" ? await getWeeklyTrends(weeks) : await getMonthlyTrends(months);

  return sendSuccess(res, { mode, points: data }, "Dashboard trends fetched successfully");
});

const recent = asyncHandler(async (req, res) => {
  const data = await getRecentActivity(req.query.limit);
  return sendSuccess(res, data, "Recent activity fetched successfully");
});

module.exports = {
  overview,
  trends,
  recent,
};
