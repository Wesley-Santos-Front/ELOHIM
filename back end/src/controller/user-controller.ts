import type {Request, Response} from "express";
import {prisma} from "../db.js";
import jwt from "jsonwebtoken";


//função login 
export const login = async (req: Request, res: Response) => {
 try{
  const {user, password}=req.body;

  //verifica se o usuário digitou no front 
  if(!user || !password){
    res.status(400).json({message:"Usuário e senha obrigatórios!"});
    return
  }

  const usuario = await prisma.usuario.findFirst({
    where:{usuario:user, senha:password}
  });

  if(!usuario){
    res.status(404).json({message: "Usuário e/ou senha não encontrado!"});
    return;
  }

  const usuarioVer ={
    usuario:usuario.usuario,
  }

  if(!process.env.JWT_SECRET){
    return;
  }

  const token = jwt.sign(usuarioVer, process.env.JWT_SECRET);

  res.cookie("usuario", token, {maxAge: 18000000,});

  res.json(usuarioVer);
  }catch(error){
    res.status(500).json({message: "Erro no servidor, tente novamente mais tarde!"});
  }
}

//função auth
export const auth = async (req: Request, res: Response) =>{
  try{
  const {usuario} = req;
  res.status(200).json(usuario);
  }catch(error){
    res.status(500).json({message: "Erro no servidor, tente novamente mais tarde!"});
    return;
  }
}

//função logOut
export const logout = async (req: Request, res: Response) => {
  const {usuario} = req.cookies;

  if(usuario){
    res.clearCookie("usuario");
    res.json({message: "Usuario deslogado"});
  }

  console.log(usuario);
}