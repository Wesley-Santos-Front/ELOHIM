import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { userLog } = useContext(UserContext);

  // Se o usuário já está autenticado no contexto, redireciona para o painel
  if (userLog) {
    return <Navigate to="/painel" replace />;
  }

  // Se não estiver logado, libera o acesso à página de Login
  return <>{children}</>;
};

export default PublicRoute;