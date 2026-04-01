import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/db.config.js";

class Debt extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "idUser",
      as: "users",
    });
  }
}

Debt.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nameProductOld: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idUserUpdate: {
      type: DataTypes.INTEGER,
    },
    idUserCreate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantityProduct: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    dateDebCreate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    note: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    priceProduct: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false,
    },
    debtPaid: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Debt",
    tableName: "debtUser",
    timestamps: true,
  },
);

export default Debt;