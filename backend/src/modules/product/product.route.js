import { Router } from "express";
import { requireAuth } from "../../shared/middlewares/authentication.js";
import { addProduct, getFeeByIdProduct, getProducts, updateInfoProduct } from "./product.controller.js";

const router = Router();

router.get("/list-product", requireAuth('view_product'), getProducts);
router.post("/add-product", requireAuth('add_product'), addProduct);
router.get("/get-fee", requireAuth('view_fee'), getFeeByIdProduct);
router.post("/update-product", requireAuth('update_product'), updateInfoProduct)
export default router;
