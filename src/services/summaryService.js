const FinancialRecord = require("../models/FinancialRecord");

const getOverview = async () => {
  // Aggregate only active records so dashboard totals match what users can actually see.
  const totals = await FinancialRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  const byType = totals.reduce(
    (acc, item) => {
      acc[item._id] = item.total;
      return acc;
    },
    { income: 0, expense: 0 }
  );

  // Break totals down by category and record type for the dashboard widgets.
  const categoryWiseTotals = await FinancialRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: {
          category: "$category",
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id.category",
        type: "$_id.type",
        total: 1,
      },
    },
    { $sort: { total: -1 } },
  ]);

  return {
    totalIncome: byType.income,
    totalExpenses: byType.expense,
    netBalance: byType.income - byType.expense,
    categoryWiseTotals,
  };
};

const getRecentActivity = async (limit = 5) => {
  // Tie-break with createdAt so items with same date are still stable in order.
  return FinancialRecord.find({ isDeleted: false })
    .sort({ date: -1, createdAt: -1 })
    .limit(limit)
    .populate("createdBy", "name email role");
};

const getMonthlyTrends = async (months) => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

  // Group by calendar month to build a chart-friendly trend series.
  return FinancialRecord.aggregate([
    {
      $match: {
        isDeleted: false,
        date: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        type: "$_id.type",
        total: 1,
      },
    },
    { $sort: { year: 1, month: 1, type: 1 } },
  ]);
};

const getWeeklyTrends = async (weeks) => {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - (weeks - 1) * 7);

  // Group by ISO week so weekly charts line up correctly across month boundaries.
  return FinancialRecord.aggregate([
    {
      $match: {
        isDeleted: false,
        date: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $isoWeekYear: "$date" },
          week: { $isoWeek: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        week: "$_id.week",
        type: "$_id.type",
        total: 1,
      },
    },
    { $sort: { year: 1, week: 1, type: 1 } },
  ]);
};

module.exports = {
  getOverview,
  getRecentActivity,
  getMonthlyTrends,
  getWeeklyTrends,
};
