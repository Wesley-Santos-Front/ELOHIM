import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const PublicRoute = ({children} : {children: ReactNode}) => {
  const [isChecking, setIschecking] = useState(true);
  const navigate = useNavigate();

  useEffect (() =>{
    const cookie = document.cookie;

    if(cookie){
      const cookies = cookie.split("; ");
      const usuarioCookie = cookies.find((c) => c.startsWith("usuario="));

      if(usuarioCookie){
        navigate("/painel", {replace: true});
        return;
      }
    }
    setIschecking(false);
  }, [navigate]);
  if(isChecking){
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f12] text-white">
        {/* Spinner Animado */}
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
        
        {/* Texto elegante */}
        <p className="mt-4 text-sm font-medium tracking-widest uppercase text-zinc-400 animate-pulse">
          Verificando acesso...
        </p>
      </div>
      );

  }

  return <div>{children}</div>
}
export default PublicRoute;