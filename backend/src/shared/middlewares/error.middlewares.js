import AppError from "../../shared/utils/appError.js";
import data_env from "../../config/env.config.js";

// Hàm xử lý lỗi trùng lặp (Unique Constraint) của Sequelize
const handleSequelizeUniqueError = (err) => {
  const message = `Dữ liệu bị trùng: ${err.errors[0].path}. Vui lòng dùng giá trị khác!`;
  return new AppError(message, 400);
};

// Hàm xử lý lỗi sai kiểu dữ liệu (Validation Error) của Sequelize
const handleSequelizeValidationError = (err) => {
  const errors = err.errors.map((el) => el.message);
  const message = `Dữ liệu không hợp lệ: '${errors.join(". ")}'`;
  return new AppError(message, 400);
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Chế độ DEVELOPMENT (Hiện lỗi chi tiết cho lập trình viên)
  if (data_env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Chế độ PRODUCTION (Hiện thông báo sạch sẽ cho người dùng)
  else {
    let error = { ...err };
    error.message = err.message;
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
};

export default globalErrorHandler;
