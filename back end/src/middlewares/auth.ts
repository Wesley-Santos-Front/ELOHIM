import type { NextFunction, Request, Response } from "express"
import  jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const {usuario} = req.cookies;

  if(!process.env.JWT_SECRET){
    res.status(500).json({message: "Erro no servidor, tente novamente mais tarde!"});
    return;
  }

   try{
  const decoded = jwt.verify(usuario, process.env.JWT_SECRET);
  req.usuario = decoded;
   next();
  }catch(error){
res.status(401).json({message: "Usuário não autenticado"});
    return;
  }
  
}