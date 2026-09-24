import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./src/routes.js";

const app = express();

// Middleware CORS totalmente aberto para teste
app.use(cors({
  origin: true, // Aceita qualquer origem (inclusive Vercel)
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());
app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));