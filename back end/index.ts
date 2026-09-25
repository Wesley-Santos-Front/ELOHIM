import express,  { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./src/routes.js";

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: "https://elohim-8iir.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200
};

// 1. CORS deve ser sempre o primeiro middleware
app.use(cors(corsOptions));

// 2. Middlewares de suporte
app.use(express.json());
app.use(cookieParser());

// 3. Rotas da aplicação
app.use(router);

// 4. Rota não encontrada (404) formatada em JSON com CORS mantido
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `A rota [${req.method}] ${req.url} não foi encontrada neste servidor.`
  });
});

// 5. Middleware global de erros (500)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Erro interno no servidor:", err);
  res.status(500).json({
    message: "Erro interno no servidor",
    error: err.message
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});