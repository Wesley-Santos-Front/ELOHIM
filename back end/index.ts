import express, { type Request, type Response } from "express";
import cors from "cors";
import { router } from "./src/routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Configuração do CORS
app.use(cors({
  origin: [
    "https://elohim-8iir.vercel.app", // Adicionado o protocolo https:// obrigatório
    "http://localhost:5173",          // Permite testes locais na sua máquina
    "http://localhost:3000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(router);

// Uso da porta dinâmica do ambiente (Render) ou 3000 como fallback
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando na porta ${PORT}`);
});