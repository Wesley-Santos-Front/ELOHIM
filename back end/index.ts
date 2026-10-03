import express, {type Request, type Response} from "express";
import cors from "cors";
import {router} from "./src/routes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "https://elohim-8iir.vercel.app",
  credentials: true,
}));
app.use(router);

app.listen(3000, () => {
  console.log("Servidor funcionando");
})