const lodash = require("lodash");

const getInfoData = ({ fields = [], object = {} }) => {
  return lodash.pick(object, fields);
};

const handleErrorResponse = (error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
};

module.exports = { getInfoData, handleErrorResponse };
