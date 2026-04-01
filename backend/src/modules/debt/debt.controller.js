import {
  getAggregateDebts,
  getAggregateDebt,
  addDebtService,
} from "./debt.service.js";
import catchAsync from "../../../utils/catchAsync.js";

export const getListDebtByUser = catchAsync(async (req, res) => {
  const { idUser } = req.params;
  const results = await getAggregateDebt(idUser);
  return res.json({ status: 'success', data: results });
});

export const getListDebt = catchAsync(async (req, res) => {
  const { limit, offset, search = "" } = req.query;
  const results = await getAggregateDebts(limit, offset, search);
  return res.send({ status: 'success', data: results });
});

export const addDebt = catchAsync(async (req, res) => {
  const { data } = req.body;
  // 1. Kiểm tra đầu vào cơ bản (Validation)

  const results = await addDebtService(data);

  if (results.failureCount > 0) {
    return res.status(207).send({
      status: "success", // partial_success
      message: `Đã xử lý xong: thành công ${results.successCount}, thất bại ${results.failureCount}`,
      data: results.data,
    });
  }
  // Nếu tất cả đều thành công
  return res.send({
    status: "success",
    message: "Tất cả bản ghi đã được thêm thành công.",
    data: results.data,
  });
});
