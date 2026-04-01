import { Sequelize } from "sequelize";
import config from "./env.config.js";

const { PORT_DB, HOST_DB, PASSWORD_DB, USER_DB, NAME_DB } = config;

const sequelize = new Sequelize(NAME_DB, USER_DB, PASSWORD_DB, {
  host: HOST_DB,
  port: PORT_DB,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 100,
    min: 2,
    idle: 10000,
    acquire: 10000,
    evict: 10000,
  },
  define: {
    timestamps: false,
    freezeTableName: true,
  },
  timezone: "+07:00",
});
sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));
export default sequelize;
