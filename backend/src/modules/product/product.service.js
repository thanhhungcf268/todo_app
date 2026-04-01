import { Sequelize } from "sequelize";
import { Product , FeeTimeLine} from "../../models/index.js";
import appError from "../../../utils/appError.js";

export const getListProducts = async (limit, offset, search) => {
  const results = await Product.findAll({
    attributes: ["id", "nameProduct", "sellingPrice", "info"],
    where: {
      nameProduct: {
        [Sequelize.Op.like]: `%${search}%`,
      },
    },
    order: [["id", "DESC"]],
    limit: +limit,
    offset: (offset - 1) * limit,
    raw: true,
  });
  return results;
};

export const addProductService = async (
  sellingPrice,
  nameProduct,
  info,
  fee,
) => {
  const nameProductRegex = nameProduct.replace(/\s+/g, " ");
  const inFoRegex = info.replace(/\s+/g, " ");

  const rCheckNameProductExit = await checkNameProductExit(nameProductRegex);

  if (rCheckNameProductExit) {
    throw new appError("Name Product Exit!", 400);
  }
  const results = await Product.create({
    nameProduct: nameProductRegex,
    info: inFoRegex,
    sellingPrice,
  });
  if (!results?.id) {
    throw new appError("add Product fail", 400);
  }
  const resultAddFee = await addPriceFee(results.id, fee);
  return;
};

export const checkNameProductExit = async (nameProduct) => {
  const result = await Product.findOne({
    attributes: ["id"],
    where: {
      nameProduct: nameProduct,
    },
  });
  return result;
};

export const addPriceFee = async (idProduct, fee) => {
  const result = await FeeTimeLine.create({
    idProduct,
    priceFee: fee,
  });
  if (result?.id) return true;
  return false;
};

export const getPriceProductTimeLineLast = async (idProduct) => {
  const results = await FeeTimeLine.findOne({
    attributes: ["priceFee"],
    where: {
      idProduct,
    },
    order: [["id", "DESC"]],
    limit: 1,
    raw: true, 
  })
  if (results) return results;
  return false;
};

export const updateProductService = async (
  {info,
  idProduct,
  sellingPrice,
  fee,
  nameProduct,}
) => {
  const nameProductRegex = nameProduct.replace(/\s+/g, " ").trim();
  const inFoRegex = info.replace(/\s+/g, " ").trim();
  const priceTimeLineLast = await getPriceProductTimeLineLast(idProduct);

  const isUPdateFee = !priceTimeLineLast || (priceTimeLineLast && priceTimeLineLast?.priceFee != fee);
  if (isUPdateFee) {
    await addPriceFee(idProduct, fee);
  }

  const rCheckNameProductExit = await checkNameProductExit(nameProductRegex);
  if (!rCheckNameProductExit || rCheckNameProductExit?.id === idProduct) {
    await Product.update(
      {
        sellingPrice,
        nameProduct: nameProductRegex,
        info: inFoRegex,
      },
      {
        where: {
          id: idProduct,
        },
      },
    );  
  } else if (!isUPdateFee) {
    throw new appError("Name Product Exit!", 400);
  }
  return;
};

export const updateFeeTimeLineService = async (fee, idProduct) => {
  const priceTimeLineLast = await getPriceProductTimeLineLast(idProduct);
  if (!priceTimeLineLast || (priceTimeLineLast && priceTimeLineLast?.priceFee != fee)) {
    return await addPriceFee(idProduct, fee);
  }
  throw new appError("Price Fee Product not change!", 400);
}
