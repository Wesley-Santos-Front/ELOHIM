import type { Request, Response } from "express";
import { prisma } from "../db.js";
import jwt from "jsonwebtoken";

// Função de login 
export const login = async (req: Request, res: Response) => {
  try {
    const { user, password } = req.body;

    // Verifica se o utilizador preencheu os campos
    if (!user || !password) {
      res.status(400).json({ message: "Usuário e senha obrigatórios!" });
      return;
    }

    const usuario = await prisma.usuario.findFirst({
      where: { usuario: user, senha: password }
    });

    if (!usuario) {
      res.status(404).json({ message: "Usuário e/ou senha não encontrado!" });
      return;
    }

    const usuarioVer = {
      usuario: usuario.usuario,
    };

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: "Erro de configuração no servidor (JWT_SECRET ausente)." });
      return;
    }

    const token = jwt.sign(usuarioVer, process.env.JWT_SECRET);

    // Definição do cookie necessária para funcionamento Cross-Site (Vercel -> Render)
    res.cookie("usuario", token, {
      maxAge: 18000000, // 5 horas
      httpOnly: true,
      secure: true,      // Obriga utilização de HTTPS
      sameSite: "none",  // Permite o envio entre domínios diferentes
    });

    res.json(usuarioVer);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor, tente novamente mais tarde!" });
  }
};

// Função de autenticação
export const auth = async (req: Request, res: Response) => {
  try {
    const { usuario } = req;
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor, tente novamente mais tarde!" });
  }
};

// Função de logout
export const logout = async (req: Request, res: Response) => {
  const { usuario } = req.cookies;

  // Para remover um cookie SameSite=None, as opções devem corresponder às da criação
  res.clearCookie("usuario", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.json({ message: "Usuário deslogado" });
};

//função ping
export const ping = async (req:Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
    message: "pong",
    timestamp: new Date().toISOString(),
  });
}