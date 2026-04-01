const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");
const { USER_STATUSES } = require("../constants/roles");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Require a Bearer token before touching any protected route.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authentication token is required", 401);
  }

  const token = authHeader.split(" ")[1];

  let payload;
  try {
    // Token verification is isolated here so expired or tampered tokens fail fast.
    payload = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    throw new AppError("Invalid or expired authentication token", 401);
  }

  const user = await User.findById(payload.userId);

  if (!user) {
    throw new AppError("User no longer exists", 401);
  }

  if (user.status !== USER_STATUSES.ACTIVE) {
    throw new AppError("User account is inactive", 403);
  }

  req.user = user;
  next();
});

module.exports = { protect };
