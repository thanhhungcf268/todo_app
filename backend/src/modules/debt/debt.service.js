import { Sequelize } from "sequelize";
import sequelize from "../../config/db.config.js";
import { User, Debt } from "../../models/index.js";
import appError from "../../../utils/appError.js";

export const getAggregateDebt = async (idUser) => {
  const results = await Debt.findAll({
    attributes: [
      "id",
      "priceProduct",
      "debtsPaid",
      "nameProductOld",
      "quantityProduct",
      "dateDebCreate",
      "note",
      [
        sequelize.literal("COALESCE(priceProduct - debtsPaid, 0)"),
        "remainingDebt",
      ],
    ],
    where: { idUser },
    order: [["dateDebCreate", "DESC"]],
    raw: true,
  });

  return results;
};
export const getAggregateDebts = async (limit, offset, search) => {
  try {
    const summary = await User.findAll({
      attributes: [
        "id",
        "fullName",
        "phoneNumber",
        "email",
        // Tính toán các giá trị từ bảng Debt
        [
          sequelize.fn(
            "COALESCE",
            sequelize.fn("SUM", sequelize.col("debts.priceProduct")),
            0,
          ),
          "totalPrice",
        ],
        [
          sequelize.fn(
            "COALESCE",
            sequelize.fn("SUM", sequelize.col("debts.debtsPaid")),
            0,
          ),
          "totalPaid",
        ],
        [
          sequelize.literal(
            "COALESCE(SUM(debts.priceProduct - debts.debtsPaid), 0)"
          ),
          "totalRemaining",
        ],
      ],
      include: [
        {
          model: Debt,
          as: "debts", // Phải khớp với User.hasMany(Debt, { as: 'debts' })
          attributes: [],
          required: false, // Đây là LEFT JOIN: Lấy User dù không có bản ghi Debt nào,
          where: {
            status: { [Sequelize.Op.notIn]: ["cancelled"] }, // Chỉ tính các khoản nợ không bị hủy
          },
        },
      ],
      where: {
        ...(search && {
          [Sequelize.Op.or]: [
            { fullName: { [Sequelize.Op.like]: `%${search}%` } },
            { phoneNumber: { [Sequelize.Op.like]: `%${search}%` } },
            { email: { [Sequelize.Op.like]: `%${search}%` } },
          ],
        }),
      },
      group: ["User.id"],
      order: [[sequelize.literal("totalRemaining"), "DESC"]],
      limit: +limit || 10,
      offset: (offset - 1) * (limit || 10) || 0,
      subQuery: false,
      raw: true
    });
    return summary;
  } catch (error) {
    console.error("Lỗi Query:", error);
    throw new appError("Lỗi khi truy vấn dữ liệu tổng hợp: " + error.message, 400);
  }
};

export const addDebtService = async (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new appError("Dữ liệu không hợp lệ hoặc danh sách rỗng.", 400);
  }
  const results = await Promise.allSettled(
    data.map((debt) =>
      Debt.create({
        idUser: debt.idUser,
        idUserCreate: debt.idUserCreate,
        priceProduct: debt.priceProduct,
        debtsPaid: debt.debtPaid,
        quantityProduct: debt.quantityProduct,
        note: debt.note,
      }),
    ),
  );
  const successData = [];
  const failureDetails = [];

  results.forEach((res, index) => {
    if (res.status === "fulfilled") {
      // Thành công: res.value là kết quả từ Debt.create
      successData.push(res.value);
    } else {
      // Thất bại: res.reason chứa thông tin lỗi
      failureDetails.push({
        index, // Vị trí dòng bị lỗi để bạn dễ đối chiếu
        idUser: debtDataArray[index].idUser,
        error: res.reason?.message || "Lỗi không xác định",
      });
    }
  });

  return {
    success: failureDetails.length === 0,
    total: debtDataArray.length,
    successCount: successData.length,
    failureCount: failureDetails.length,
    data: successData,
    errors: failureDetails,
  };
};
