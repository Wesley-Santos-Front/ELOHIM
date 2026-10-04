import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext"; // Ajuste a pasta se necessário

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { userLog, loading } = useContext(UserContext);

  // 1. Enquanto o UserContext estiver a consultar a rota /me no Render, exibe o ecrã de carregamento
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f12] text-white">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium tracking-widest uppercase text-zinc-400 animate-pulse">
          Autenticando...
        </p>
      </div>
    );
  }

  // 2. Se a validação terminou e não existe utilizador autenticado, redireciona para o Login
  if (!userLog) {
    return <Navigate to="/" replace />;
  }

  // 3. Utilizador autenticado com sucesso
  return <>{children}</>;
};

export default PrivateRoute;