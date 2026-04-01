import express, { urlencoded, json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import data_env from "./config/env.config.js";
// import { authenticationWithPassport } from "./middlewares/authentication.js";
import routers from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middlewares.js";

const app = express();

app
  .use(json())
  .use(urlencoded({ extended: true }))
  .use(
    cors({
      origin: data_env.NODE_ENV === 'development' ? "http://localhost:5173": data_env.URL_CLIENT,
      credentials: true,
    }),
  )
  .use(cookieParser());
// .use(authenticationWithPassport());
app.use("", routers);

app.get("/", function (req, res) {
  return res.send("Hello World!");
});

app.use(errorMiddleware);

app.listen(data_env.PORT, function () {
  console.log(`Example app listening on port ${data_env.PORT}!`);
});
