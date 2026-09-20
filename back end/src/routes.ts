import {Router} from "express";
import {auth, login, logout} from "./controller/user-controller.js";
import { memberPost, memberGet, memberDelete, memberUpdate } from "./controller/members-controller.js";
import { authMiddleware } from "./middlewares/auth.js";

export const router = Router();

//rota de usuario
router.post("/login", login);
router.get("/me",authMiddleware, auth);
router.post("/logout",authMiddleware, logout);

//rota de membros
router.post("/cadastro",authMiddleware, memberPost);
router.get("/busca", authMiddleware, memberGet);
router.delete("/delete/:id", authMiddleware, memberDelete);
router.put("/editar/:id", authMiddleware, memberUpdate);