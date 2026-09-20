import { Navigate, Route, Routes } from 'react-router-dom'
import Birthdays from './pages/Birthdays'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Members from './pages/Members'
import NewMember from './pages/NewMember'
import Recommendation from './pages/Recommendation'
import { UserContext } from './contexts/UserContext'
import { useContext, useEffect } from 'react'
import PublicRoute from './components/PublicRoute'
import PrivateRoute from './components/PrivateRoute'
import EditMember from './pages/EditMember'
import ViewMember from './pages/ViewMember'

export default function App() {
  const {userLog, setUserlog } = useContext(UserContext);
  

const handleAuthUser = async () =>{
  const response = await fetch("http://localhost:3000/me", {
    credentials: "include",
  });
  if(response.status !== 200){
    return;
  }

  const data = await response.json();
  setUserlog(data);

  console.log(data);
}

useEffect(() => {
  handleAuthUser();
}, [])

  return <Routes>
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/" element={<PublicRoute><Navigate to="/login" replace /></PublicRoute>} />
    <Route path="/painel" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    <Route path="/membros" element={<PrivateRoute><Members /></PrivateRoute>} />
    <Route path="/novo-cadastro" element={<PrivateRoute><NewMember /></PrivateRoute>} />
    <Route path="/aniversariantes" element={<PrivateRoute><Birthdays /></PrivateRoute>} />
    <Route path="/carta-recomendacao" element={<PrivateRoute><Recommendation /></PrivateRoute>} />
    <Route path='/editar-membro/:id' element={<PrivateRoute><EditMember/></PrivateRoute>} />
    <Route path='/membro/:id' element={<PrivateRoute><ViewMember/></PrivateRoute>} />
    </Routes>
}
