import { Router } from "express";
import { requireAuth } from "../../shared/middlewares/authentication.js";
import { getListDebt , getListDebtByUser, addDebt} from "./debt.controller.js";

const router = Router();

router.get('/list-debt', requireAuth('view_debt'), getListDebt)
router.get('/list-debt/:idUser', requireAuth('view_debt_by_user'), getListDebtByUser)
router.post('/add-debt', requireAuth('add_debt'), addDebt)

export default router;