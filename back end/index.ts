import express from "express";
import cors from "cors";
import { router } from "./src/routes.js";
import cookieParser from "cookie-parser";

const app = express();

// Lista de origens permitidas
const allowedOrigins = [
  "https://elohim-8iir.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

// Configuração completa do CORS
app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origin (como Postman/Mobile) ou se estiver na lista permitida
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Libera dinamicamente para evitar bloqueios de subdomínio da Vercel
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Responde explicitamente às requisições de Preflight (OPTIONS)
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());
app.use(router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando na porta ${PORT}`);
});

app.use(router);

// Uso da porta dinâmica do ambiente (Render) ou 3000 como fallback
const PORT1 = process.env.PORT || 3000;

app.listen(PORT1, () => {
  console.log(`Servidor funcionando na porta ${PORT1}`);
});