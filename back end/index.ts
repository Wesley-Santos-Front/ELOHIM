import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./src/routes.js";

const app = express();

// 1. O CORS deve ser SEMPRE o primeiro middleware a ser chamado
app.use(cors({
  origin: ["https://elohim-8iir.vercel.app", "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. Tratar requisições Preflight (OPTIONS) explicitamente
app.options("*", cors() as any);

// 3. Demais middlewares
app.use(express.json());
app.use(cookieParser());

// 4. Rotas da aplicação
app.use(router);

// 5. Utilizar a porta fornecida pelo Railway (process.env.PORT) ou 3000 localmente
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor a rodar na porta ${PORT}`);
});