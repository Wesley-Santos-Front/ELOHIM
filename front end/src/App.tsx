import { Navigate, Route, Routes } from 'react-router-dom'
import Birthdays from './pages/Birthdays'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Members from './pages/Members'
import NewMember from './pages/NewMember'
import Recommendation from './pages/Recommendation'
import { UserContext } from './contexts/UserContext'
import { useContext, useEffect, useState } from 'react'
import PublicRoute from './components/PublicRoute'
import PrivateRoute from './components/PrivateRoute'
import EditMember from './pages/EditMember'
import ViewMember from './pages/ViewMember'

export default function App() {
  const { userLog, setUserlog } = useContext(UserContext);
  const [loading, setLoading] = useState(true);


  const handleAuthUser = async () => {
    try {
      const response = await fetch("https://elohim-sogr.onrender.com/me", {
        credentials: "include",
      });

      if (response.status === 200) {
        const data = await response.json();
        setUserlog(data);
      } else {
        setUserlog(null);
      }
    } catch (error) {
      console.error("Erro ao validar sessão:", error);
      setUserlog(null);
    } finally {
      setLoading(false); // Libera o app somente após a resposta do servidor
    }
  }

  useEffect(() => {
    handleAuthUser();
  }, []);

  // Enquanto estiver verificando o /me, exibe uma tela de carregamento para o PrivateRoute não redirecionar precocemente
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#121212', 
        color: '#D4AF37' 
      }}>
        <p>Carregando Elohim...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/" element={<PublicRoute><Navigate to="/login" replace /></PublicRoute>} />
      <Route path="/painel" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/membros" element={<PrivateRoute><Members /></PrivateRoute>} />
      <Route path="/novo-cadastro" element={<PrivateRoute><NewMember /></PrivateRoute>} />
      <Route path="/aniversariantes" element={<PrivateRoute><Birthdays /></PrivateRoute>} />
      <Route path="/carta-recomendacao" element={<PrivateRoute><Recommendation /></PrivateRoute>} />
      <Route path="/editar-membro/:id" element={<PrivateRoute><EditMember /></PrivateRoute>} />
      <Route path="/membro/:id" element={<PrivateRoute><ViewMember /></PrivateRoute>} />
    </Routes>
  );
}