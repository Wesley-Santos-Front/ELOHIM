import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Leitura segura do cookie 'usuario' usando optional chaining (?.)
    const token = req.cookies?.usuario;

    if (!token) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // 2. Chave secreta alinhada com o fallback do login
    const jwtSecret = process.env.JWT_SECRET || "chave_secreta_fallback_elohim";

    // 3. Validação do token
    const decoded = jwt.verify(token, jwtSecret);

    // 4. Anexa os dados do usuário ao objeto req de forma segura
    (req as any).usuario = decoded;

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Sessão inválida ou expirada" });
  }
};