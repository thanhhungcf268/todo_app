import AppError from "../../shared/utils/appError.js";
import { verifyToken } from "../../shared/utils/jwt.js";
import { getPermissionsByRoleId } from "../../modules/auth/auth.service.js";

export const requireAuth = (auth) => {
  return async (req, res, next) => {
    const authHeader = req.headers["authorization"];

    // Format of header: "Bearer TOKEN"
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("No token provided.", 401);
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      throw new AppError("Failed to authenticate token.", 401);
    }
    const permissions = await getPermissionsByRoleId(decoded.role_id);
    if (permissions.includes(auth)) {
      req.user = decoded; // Add decoded user payload to request object
      return next(); // Pass control to the next handler
    }
    throw new AppError("You do not have permission to access this resource.", 403);
  };
};
