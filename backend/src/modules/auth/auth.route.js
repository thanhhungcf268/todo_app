import { Router } from "express";
import { register, logIn, refreshToken } from "./auth.controller.js";

const router = Router();

router.post('/login', logIn)

router.post('/register',register)

router.post('/refresh-token', refreshToken)

export default router;