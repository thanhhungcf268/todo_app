import {
  updateFeeTimeLineService,
  addProductService,
  getListProducts,
  getPriceProductTimeLineLast,
  updateProductService,
} from "./product.service.js";
import catchAsync from "../../shared/utils/catchAsync.js";

export const getProducts = async (req, res) => {
  const { limit, offset, search } = req.query;
  const result = await getListProducts(limit, offset, search);
  return res.send({ data: result, status: "success" });
};

export const addProduct = catchAsync(async (req, res) => {
  const { nameProduct, info, sellingPrice, fee } = req.body;
  await addProductService(sellingPrice, nameProduct, info, fee);
  return res.send({ message: "add Product success", status: "success" });
});

export const updateFeeTimeLine = catchAsync(async (req, res) => {
  const { fee, idProduct } = req.body;
  await updateFeeTimeLineService(fee, idProduct);
  res.send({ message: "Update Price Product success", status: "success" });
});

export const getFeeByIdProduct = catchAsync(async (req, res) => {
  const { idProduct } = req.query;
  const result = await getPriceProductTimeLineLast(idProduct);
  if (result) {
    return res.send({ status: "success", data: result });
  }
  throw new appError("Not found fee by id Product!", 404);
});

export const updateInfoProduct = catchAsync(async (req, res) => {
  const { info, idProduct, sellingPrice, fee, nameProduct } = req.body;
  await updateProductService({
    info,
    idProduct,
    sellingPrice,
    fee,
    nameProduct,
  });
  res.send({ status: "success", message: "Update success!" });
});
