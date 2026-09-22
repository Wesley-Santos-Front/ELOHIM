import express from "express";
import cors from "cors";
import { router } from "./src/routes.js"; // Ajustado sem o .js
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Configuração do CORS
app.use(cors({
  origin: "https://elohim-8iir.vercel.app", // Seu domínio na Vercel
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(router);

// Uso obrigatório do process.env.PORT para o Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});