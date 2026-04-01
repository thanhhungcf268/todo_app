import {Model, DataTypes} from "sequelize";
import sequelize from "../../config/db.config.js";



class FeeTimeLine extends Model {}

FeeTimeLine.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    idProduct: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    priceFee: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
},{
    sequelize,
    modelName: "FeeTimeLine",
    tableName: "feeTimeLine",
    timestamps: false,
})

export default FeeTimeLine;