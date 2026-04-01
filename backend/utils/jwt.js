import jsonwebtoken from "jsonwebtoken";
import AppError from "./appError.js";

const { JWT_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export const generateRefreshToken = (user_id, client_ip) => {
  return jsonwebtoken.sign({ user_id, client_ip }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
export const generateToken = (user_id, role_id, permissions) => {
  return jsonwebtoken.sign({ user_id, role_id, permissions }, JWT_SECRET, {
    expiresIn: "24h",
  });
};

export const verifyToken = (token, isRefresh = false) => {
  try {
    const secret = isRefresh ? REFRESH_TOKEN_SECRET : JWT_SECRET;
    const decoded = jsonwebtoken.verify(token, secret);
    return decoded;
  } catch (err) {
    if (err.name === "TokenExpiredError" && !isRefresh) {
      throw new AppError("TokenExpiredError", 401)
    }
    return null; // Nếu token không hợp lệ hoặc đã hết hạn, trả về null
  }
};
