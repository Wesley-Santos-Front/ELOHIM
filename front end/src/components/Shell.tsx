import { Link, NavLink } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
const backend = import.meta.env.VITE_BACKEND_URL;

const links = [
  ['Painel', '/painel'],
  ['Membros', '/membros'],
  ['Novo Cadastro', '/novo-cadastro'],
  ['Aniversariantes', '/aniversariantes'],
  ['Carta de Recomendação', '/carta-recomendacao'],
]

export function Shell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { userLog, setUserlog } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${backend}/logout`, {
        credentials: "include",
        method: "POST",
      })

      if (!response.ok) {
        return;
      }
      setUserlog(null);
      toast.success("LogOut realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      console.log(error);
      return;
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/painel">
          {/* Imagem do ícone arredondada substituindo a letra 'E' */}
          <img 
            src="/icon-elohim.png" 
            alt="Elohim Logo" 
            className="brand-mark-icon"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid #3f3f46',
              flexShrink: 0
            }}
          />
          <span>
            <span className="brand-name">Elohim</span>
            <span className="brand-sub">MINISTÉRIO</span>
          </span>
        </Link>
        <nav className="nav">
          {links.map(([label, path]) => (
            <NavLink key={path} to={path}>{label}</NavLink>
          ))}
        </nav>
        <button className="logout" onClick={() => handleLogout()} type="button">Sair</button>
      </aside>
      <main className="main">
        <header className="topbar">SISTEMA MINISTERIAL</header>
        {children}
      </main>
    </div>
  )
}

export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <>
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p className="muted">{description}</p>
    </>
  )
}