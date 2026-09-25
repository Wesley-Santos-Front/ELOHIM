import type { Request, Response } from "express";
import { prisma } from "../db.js";
import jwt from "jsonwebtoken";

// Opções de Cookie para Comunicação Cross-Domain (Vercel <-> Railway)
const COOKIE_OPTIONS = {
  maxAge: 18000000, // 5 horas
  httpOnly: true,
  secure: true,     // Obrigatório para HTTPS (Vercel <-> Railway)
  sameSite: "none" as const, // Obrigatório para permitir leitura em domínios diferentes
};

// Função Login 
export const login = async (req: Request, res: Response) => {
  try {
    const { user, password } = req.body;

    // Verifica se o usuário digitou no frontend 
    if (!user || !password) {
      return res.status(400).json({ message: "Usuário e senha obrigatórios!" });
    }

    const usuario = await prisma.usuario.findFirst({
      where: { usuario: user, senha: password }
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário e/ou senha não encontrado!" });
    }

    const usuarioVer = {
      usuario: usuario.usuario,
    };

    // Caso a variável JWT_SECRET não esteja setada no Railway, usa um fallback para a API não travar
    const jwtSecret = process.env.JWT_SECRET || "chave_secreta_fallback_elohim";

    const token = jwt.sign(usuarioVer, jwtSecret, { expiresIn: "5h" });

    // Envia o cookie seguro para requisições cross-domain
    res.cookie("usuario", token, COOKIE_OPTIONS);

    return res.status(200).json(usuarioVer);
  } catch (error) {
    console.error("ERRO NO LOGIN:", error);
    return res.status(500).json({ message: "Erro no servidor, tente novamente mais tarde!" });
  }
};

// Função Auth (/me)
export const auth = async (req: Request, res: Response) => {
  try {
    // req.usuario deve ser populado pelo authMiddleware
    const usuario = (req as any).usuario;

    if (!usuario) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error("ERRO NA AUTENTICAÇÃO:", error);
    return res.status(500).json({
      message: "Erro no servidor",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Função LogOut
export const logout = async (req: Request, res: Response) => {
  try {
    // Para apagar um cookie cross-site, é obrigatório passar as mesmas opções de secure e sameSite
    res.clearCookie("usuario", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({ message: "Usuário deslogado com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao realizar logout" });
  }
};