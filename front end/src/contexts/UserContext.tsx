import { createContext, ReactNode, useState, useEffect } from "react";
import type { UserContextType } from "../types/User";


// Dica: Adicione 'loading?: boolean' na sua interface UserContextType no arquivo types/User.ts
export const UserContext = createContext<any>({
  userLog: null,
  setUserlog: () => {},
  loading: true,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userLog, setUserlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("https://elohim-sogr.onrender.com/me", {
          method: "GET",
          credentials: "include", // Permite o envio dos cookies do Render
        });

        if (response.ok) {
          const data = await response.json();
          setUserlog(data);
          
        } else {
          setUserlog(null);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setUserlog(null);
      } finally {
        setLoading(false); // Libera as rotas após a checagem ser concluída
      }
    }

    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ userLog, setUserlog, loading }}>
      {children}
    </UserContext.Provider>
  );
};