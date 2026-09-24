import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { router } from "./src/routes.js";

const app = express();

const allowedOrigins = [
    "https://elohim-8iir.vercel.app",
    "http://localhost:5173",
    "http://localhost:8080"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

app.use(express.json());
app.use(cookieParser());

app.use(router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});