import sequelize from "../config/db.config.js";
import { Sequelize } from "sequelize";

const Permission = sequelize.define("permissions", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  permission_key: {
    type: Sequelize.STRING(100),
    allowNull: false,
    unique: true,
  },
  name: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  group_name: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  createAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});
const Role = sequelize.define("roles", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING(50),
    allowNull: false,
    unique: true,
  },
  display_name: {
    type: Sequelize.STRING(100),
    defaultValue: "",
  },
  description: {
    type: Sequelize.STRING(100),
    defaultValue: "",
  },
  createAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});
// const User = sequelize.define(
//   "users",
//   {
//     id: {
//       type: Sequelize.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     email: {
//       type: Sequelize.STRING(100),
//       allowNull: false,
//       unique: true,
//     },
//     fullName: {
//       type: Sequelize.STRING(50),
//       defaultValue: "",
//     },
//     userPassword: {
//       type: Sequelize.STRING(100),
//       allowNull: false,
//     },
//     passport: {
//       type: Sequelize.STRING(50),
//       defaultValue: "",
//     },
//     createDate: {
//       type: Sequelize.DATE,
//       defaultValue: Sequelize.NOW,
//     },
//     idImage: {
//       type: Sequelize.INTEGER,
//       defaultValue: 1,
//     },
//     addressUser: {
//       type: Sequelize.STRING(100),
//       defaultValue: "",
//     },
//     phoneNumber: {
//       type: Sequelize.STRING(15),
//       defaultValue: "",
//     },
//     info: {
//       type: Sequelize.STRING(100),
//       defaultValue: "",
//     },
//     role_id: {
//       type: Sequelize.INTEGER,
//       references: {
//         model: "roles",
//         key: "id",
//       },
//     },
//   },
//   {
//     timestamps: false,
//     tableName: "users",
//   },
// );

// User.hasMany(Debt, { as: "debts", foreignKey: "idUser" });
// Role.hasMany(User, { as: "users", foreignKey: "role_id" });
// Role.belongsToMany(Permission, {
//   through: "role_permissions",
//   as: "permissions",
//   foreignKey: "role_id",
//   otherKey: "permission_id",
// });

// Permission.belongsToMany(Role, {
//   through: "role_permissions",
//   as: "roles",
//   foreignKey: "permission_id",
//   otherKey: "role_id",
// });
// User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

// export { User, Role, Permission, Debt, Product };

// import sequelize from "../config/db.config.js";
import User from "../modules/user/user.model.js";
// import Role from "../modules/role/role.model.js";
import Debt from "../modules/debt/debt.model.js";
// import Permission from "../modules/permission/permission.model.js";
import Product from "../modules/product/product.model.js";
import FeeTimeLine from "../modules/feeTimeLine/feeTimeLine.model.js";

const models = {
  User,
  Role,
  Debt,
  Permission,
  Product,
  FeeTimeLine,
};

// CHẠY VÒNG LẶP ĐỂ KẾT NỐI QUAN HỆ (Rất quan trọng)
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

// Xuất ra để dùng trong Service
export { sequelize, User, Role, Debt, Permission, Product, FeeTimeLine };

export default models;
