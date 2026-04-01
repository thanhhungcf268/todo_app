import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/db.config.js";
import bcrypt from "bcrypt";

import { encrypt } from "../../shared/utils/encrypt.js";

class User extends Model {
  // Hàm này để thiết lập quan hệ với các bảng khác
  static associate(models) {
    // Một User có nhiều khoản nợ (Debt)
    this.hasMany(models.Debt, {
      foreignKey: "idUser",
      as: "debts",
    });
  }

  // Hàm kiểm tra mật khẩu (Dùng khi Login)
  async checkPassword(password) {
    return await bcrypt.compare(password, this.userPassword);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    fullName: {
      type: DataTypes.STRING(50),
      defaultValue: "",
    },
    phoneNumber: {
      type: DataTypes.STRING(15),
      defaultValue: "",
    },
    userPassword: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false,
    hooks: {
      // Tự động mã hóa mật khẩu trước khi lưu vào database
      beforeCreate: async (user) => {
        if (user.userPassword) {
          user.userPassword = await encrypt(user.userPassword);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("userPassword")) {
          user.userPassword = await encrypt(user.userPassword);
        }
      },
    },
  },
);

export default User;
