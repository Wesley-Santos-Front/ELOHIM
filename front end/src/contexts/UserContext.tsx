import { createContext, ReactNode, useState, useEffect } from "react";
import type { UserContextType } from "../types/User";

// Variable com fallback caso o .env do Vite não esteja carregado
const API_URL = import.meta.env.VITE_API_URL;

export const UserContext = createContext<any>({
  userLog: null,
  setUserlog: () => {},
  loading: true,
  isServerAlive: true,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userLog, setUserlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isServerAlive, setIsServerAlive] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        // 1. Dispara o PING para acordar/validar o servidor no Render
        const pingRes = await fetch(`${API_URL}/ping`);
        
        if (!pingRes.ok) {
          setIsServerAlive(false);
          setUserlog(null);
          return;
        }

        setIsServerAlive(true);

        // 2. Se o servidor respondeu, valida o cookie de sessão do usuário
        const response = await fetch(`${API_URL}/me`, {
          method: "GET",
          credentials: "include", // Envia os cookies para o Render
        });

        if (response.ok) {
          const data = await response.json();
          setUserlog(data);
        } else {
          setUserlog(null);
        }
      } catch (error) {
        console.error("Erro de conexão/autenticação:", error);
        setIsServerAlive(false);
        setUserlog(null);
      } finally {
        setLoading(false); // Desbloqueia a renderização das rotas no React
      }
    }

    initAuth();
  }, []);

  return (
    <UserContext.Provider value={{ userLog, setUserlog, loading, isServerAlive }}>
      {children}
    </UserContext.Provider>
  );
};