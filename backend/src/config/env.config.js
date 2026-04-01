import dotenv from "dotenv";
dotenv.config();

const { PERMISSION_KEY_SECRET,URL_CLIENT,NODE_ENV, PORT, HOST, NAME_DB, PORT_DB, HOST_DB, USER_DB, PASSWORD_DB, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, JWT_SECRET, REFRESH_TOKEN_SECRET } = process.env;  


const config = {
  // server
  PORT: PORT || 3000,
  HOST: HOST || "localhost",
  //   database
  NAME_DB: NAME_DB || "todo_app",
  PORT_DB: PORT_DB || 3306,
  HOST_DB: HOST_DB || "localhost",
  USER_DB: USER_DB || "root",
  PASSWORD_DB: PASSWORD_DB || "",
  //   redis
  REDIS_HOST: REDIS_HOST || "localhost",
  REDIS_PORT: REDIS_PORT || 6379,
  REDIS_PASSWORD: REDIS_PASSWORD || "",
  //   jwt
  JWT_SECRET: JWT_SECRET,
  REFRESH_TOKEN_SECRET: REFRESH_TOKEN_SECRET,
  // 
  NODE_ENV: NODE_ENV || "development",
  URL_CLIENT: URL_CLIENT,
  PERMISSION_KEY_SECRET: PERMISSION_KEY_SECRET
};

export default config;
