import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { router } from "./src/routes.js";

const app = express();

const corsOptions = {
    origin: "https://elohim-8iir.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

app.use(cors(corsOptions));

// Responde explicitamente ao preflight
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use(router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});