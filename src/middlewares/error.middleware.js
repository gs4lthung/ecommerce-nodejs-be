const checkNotFoundError = (req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
};

const handleErrorResponse = (error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
};

const catchAsyncHandle = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = { checkNotFoundError, handleErrorResponse, catchAsyncHandle };
