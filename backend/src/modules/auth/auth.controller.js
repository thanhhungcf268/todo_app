import request_ip from "request-ip";
import {
  createUserService,
  logInService,
  refreshTokenService,
} from "./auth.service.js";
import catchAsync from "../../shared/utils/catchAsync.js";
import AppError from "../../shared/utils/appError.js";

export const register = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await createUserService(email, password);
  if (result) {
    return res.send({ message: "register success!", email, status: "success" });
  }
  throw new AppError("register fail!", 400);
});

export const logIn = catchAsync(async (req, res) => {
  const { email, password } = req?.body;
  const clientIp = request_ip.getClientIp(req);

  const result = await logInService(email, password, clientIp);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  return res.send({
    message: "login success!",
    status: "success",
    data: { token: result.token, encryptPermission: result.encryptPermission },
  });
});

export const refreshToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const clientIp = request_ip.getClientIp(req);

  const {token, encryptPermission} = await refreshTokenService(
    refreshToken,
    clientIp,
  );

  return res.send({
    message: "refresh token success!",
    status: "success",
    data: { token, encryptPermission },
  });
});
