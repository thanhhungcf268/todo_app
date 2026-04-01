import { User, Role, Debt } from "../../models/index.js";

export const getUserWithData = async (id) => {
  return await User.findByPk(id, {
    include: [
      { model: Role, as: "role" },
      { model: Debt, as: "debts" },
    ],
    attributes: { exclude: ["userPassword"] }, // Không trả về mật khẩu cho an toàn
  });
};
