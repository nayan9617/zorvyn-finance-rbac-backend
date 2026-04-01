const { ZodError } = require("zod");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (err?.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid value provided for one or more fields",
      details: {
        path: err.path,
        value: err.value,
      },
    });
  }

  if (err?.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Database validation failed",
      errors: Object.values(err.errors).map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    });
  }

  if (err?.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate value violates a unique constraint",
      details: err.keyValue || null,
    });
  }

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    details: err.details || null,
  });
};

module.exports = errorHandler;
