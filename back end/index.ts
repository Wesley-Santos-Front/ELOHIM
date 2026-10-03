import express, { type Request, type Response } from "express";
import cors from "cors";
import { router } from "./src/routes.js";
import cookieParser from "cookie-parser";

const app = express();

// Lista com todas as URLs da Vercel e ambiente local
const allowedOrigins = [
  "https://elohim-8iir.vercel.app",
  "https://elohim-8iir-wesleys-projects-c31d114f.vercel.app",
  "https://elohim-8iir-git-main-wesleys-projects-c31d114f.vercel.app",
  "https://elohim-8iir-51bkc26pz-wesleys-projects-c31d114f.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (como Postman/mobile) ou origens permitidas
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Não permitido por CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(router);

app.listen(3000, () => {
  console.log("Servidor funcionando");
});