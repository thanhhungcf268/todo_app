import redisClient from "../../config/redis.js";

import { Role, User, Permission } from "../../models/index.js";

import {
  generateRefreshToken,
  generateToken,
  verifyToken,
} from "../../shared/utils/jwt.js";
import AppError from "../../shared/utils/appError.js";

export const getPermissionsByRoleId = async (role_id) => {
  const cacheKey = `role_perms:${role_id}`;

  const cachedPerms = await redisClient.get(cacheKey);
  if (cachedPerms) {
    return JSON.parse(cachedPerms);
  }
  const role = await Role.findByPk(role_id, {
    attributes: ["id"],
    include: [
      {
        model: Permission,
        as: "permissions",
        attributes: ["permission_key"],
        through: { attributes: [] },
      },
    ],
  });

  if (!role) return [];

  const rawUser = role.get({ plain: true });

  if (!rawUser.permissions) {
    return [];
  }
  const permissions = rawUser.permissions.map((p) => p.permission_key);

  await redisClient.set(cacheKey, JSON.stringify(permissions));

  return permissions;
};

export const createUserService = async (email, userPassword) => {
  try {
    const user = await getUserIdByEmail(email);
    if (user) {
      throw new AppError("Email already exists!", 400);
    }
    const newUser = await User.create({
      email: email,
      userPassword: userPassword,
    });
    return !!newUser;
  } catch (error) {
    throw new AppError("Error creating user: " + error.message, 500);
  }
};

export const getUserIdByEmail = async (email) => {
  return await User.findOne({ attributes: ["id"], where: { email: email } });
};

export const getUserIdAndPasswordByEmail = async (email) => {
  const rs = await User.findOne({
    attributes: ["id", "userPassword", "role_id"],
    where: { email: email },
  });
  return rs?.toJSON();
};

export const getUserEmailById = async (id) => {
  const rs = await User.findOne({
    attributes: ["email"],
    where: { id: id },
  });
  return rs?.toJSON();
};

export const logInService = async (email, password, clientIp) => {
  const user = await User.findOne({
    attributes: ["id", "role_id", "userPassword"],
    where: { email: email },
  });
  if (!user || !(await user.checkPassword(password)))
    throw new AppError("Email or password wrong!", 400);

  const permissions = await getPermissionsByRoleId(user.role_id);
  if (!permissions.length) {
    throw new AppError("User not have permission!", 400);
  }

  // const encryptPermission = encryptDataCrypto(permissions)

  const token = generateToken(user.id, user.role_id);
  const refreshToken = generateRefreshToken(user.id, clientIp);

  return {
    token,
    refreshToken,
    encryptPermission: permissions,
  };
};

export const refreshTokenService = async (refreshToken, clientIp) => {
  const resultVerifyRefreshToken = verifyToken(refreshToken, true);
  if (!resultVerifyRefreshToken) {
    throw new AppError("Refresh Token Fail", 401);
  }

  const { user_id, client_ip } = resultVerifyRefreshToken;
  if (client_ip != clientIp) {
    throw new AppError("Refresh Token Fail", 401);
  }

  const { role_id } = await User.findOne({
    attributes: ["role_id"],
    where: { id: user_id },
  });

  const permissions = await getPermissionsByRoleId(role_id);
  if (!permissions.length) {
    throw new AppError("User not have permission!", 400);
  }

  // const encryptPermission = encryptDataCrypto(permissions)
  const token = generateToken(user_id, role_id);

  return { token, encryptPermission: permissions };
};
