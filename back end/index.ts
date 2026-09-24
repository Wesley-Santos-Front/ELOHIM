import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./src/routes.js";

const app = express();

// 1. Configurar Origens Permitidas
const allowedOrigins = [
  "https://elohim-8iir.vercel.app",
  "http://localhost:5173"
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Permite chamadas sem origin (como requisições mobile ou ferramentas de API) ou que estejam na lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Bloqueado pelo CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

// 2. Aplicar o CORS como PRIMEIRO middleware
app.use(cors(corsOptions));

// 3. Responder imediatamente às requisições Preflight (OPTIONS)
app.options("*", cors(corsOptions));

// 4. Demais middlewares
app.use(express.json());
app.use(cookieParser());

// 5. Rotas
app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});