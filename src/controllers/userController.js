const User = require("../models/User");
const AppError = require("../utils/appError");
const { sendSuccess } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { toUserDto } = require("../utils/userDto");

const createUser = asyncHandler(async (req, res) => {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) {
    throw new AppError("A user with this email already exists", 409);
  }

  const user = await User.create(req.body);

  return sendSuccess(res, toUserDto(user), "User created successfully", 201);
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });

  return sendSuccess(
    res,
    users.map((user) => toUserDto(user)),
    "Users fetched successfully"
  );
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

  return sendSuccess(res, toUserDto(user), "User updated successfully");
});

module.exports = {
  createUser,
  listUsers,
  updateUser,
};
