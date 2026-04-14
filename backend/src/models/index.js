import sequelize from "../config/db.config.js";
import { Sequelize } from "sequelize";

// import sequelize from "../config/db.config.js";
import User from "../modules/user/user.model.js";
// import Role from "../modules/role/role.model.js";
import Debt from "../modules/debt/debt.model.js";
// import Permission from "../modules/permission/permission.model.js";
import Product from "../modules/product/product.model.js";
import FeeTimeLine from "../modules/feeTimeLine/feeTimeLine.model.js";

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
const RolePermission = sequelize.define("role_permissions", {
  role_id: {
    type: Sequelize.INTEGER,
    references: { model: 'roles', key: 'id' }
  },
  permission_id: {
    type: Sequelize.INTEGER,
    references: { model: 'permissions', key: 'id' }
  }
}, { timestamps: false });
// Role liên kết với Permission thông qua role_permissions
Role.belongsToMany(Permission, { 
  through: RolePermission, 
  as: "permissions",      // Alias dùng trong include
  foreignKey: "role_id", 
  otherKey: "permission_id" 
});

// Permission liên kết ngược lại với Role
Permission.belongsToMany(Role, { 
  through: RolePermission, 
  as: "roles", 
  foreignKey: "permission_id", 
  otherKey: "role_id" 
});

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