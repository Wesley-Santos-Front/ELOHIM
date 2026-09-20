import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cookie = document.cookie;
    const usuarioCookie = cookie.split("; ").some((c) => c.startsWith("usuario="));

    // Se NÃO tiver o cookie, redireciona para o Login
    if (!usuarioCookie) {
      navigate("/", { replace: true });
      return;
    }

    setIsChecking(false);
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f12] text-white">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium tracking-widest uppercase text-zinc-400 animate-pulse">
          Autenticando...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;