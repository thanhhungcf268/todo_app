import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/db.config.js";

class Product extends Model {
  static associate(models) {}
}
Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nameProduct: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    info: {
      type: DataTypes.STRING(100),
      defaultValue: "",
    },
    sellingPrice: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: false,
  },
);

export default Product;
