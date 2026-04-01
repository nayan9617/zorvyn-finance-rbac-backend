const User = require("../models/User");
const AppError = require("../utils/appError");
const { sendSuccess } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const createUser = asyncHandler(async (req, res) => {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) {
    throw new AppError("A user with this email already exists", 409);
  }

  const user = await User.create(req.body);

  return sendSuccess(
    res,
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    },
    "User created successfully",
    201
  );
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });

  return sendSuccess(res, users, "Users fetched successfully");
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return sendSuccess(res, user, "User updated successfully");
});

module.exports = {
  createUser,
  listUsers,
  updateUser,
};
