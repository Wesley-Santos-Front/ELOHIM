import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 1. Tenta extrair o token do Header "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader && authHeader.split(" ")[1];

  // 2. Se não estiver no Header, pega do Cookie
  const token = tokenFromHeader || req.cookies?.usuario;

  if (!token) {
    res.status(401).json({ message: "Usuário não autenticado. Token ausente!" });
    return;
  }

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ message: "Erro interno no servidor: JWT_SECRET ausente!" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next(); // Permite o acesso à rota protegida (/me, /busca, /painel)
  } catch (error) {
    res.status(401).json({ message: "Sessão inválida ou expirada." });
    return;
  }
};