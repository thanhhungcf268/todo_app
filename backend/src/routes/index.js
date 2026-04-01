import { Router } from "express";

import routerAuthorization from "../modules/auth/auth.route.js";
import debtAmount from "../modules/debt/debt.route.js";
import product from "../modules/product/product.route.js";

const routers = Router();

routers.use('/auth',routerAuthorization);
routers.use(debtAmount);
routers.use(product);

export default routers;
