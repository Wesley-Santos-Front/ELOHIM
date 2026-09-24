import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./src/routes.js";

const app = express();

const allowedOrigins = [
  "https://elohim-8iir.vercel.app"
];

// 1. Configuração ÚNICA e completa do CORS
app.use(cors({
  origin: (origin, callback) => {
    // Permite chamadas da lista ou requisições sem header origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Não permitido pelo CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200 // Compatibilidade para navegadores mais antigos
}));

app.use(express.json());
app.use(cookieParser());
app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});