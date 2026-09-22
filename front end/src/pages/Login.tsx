import { FormEvent, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserInterface } from '../types/User';
import { UserContext } from '../contexts/UserContext';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [sucess, setSucess] = useState("");
  const { setUserlog } = useContext(UserContext);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSucess("");

    try {
      if (!user.trim() || !password.trim()) {
        setError('Preencha os campos de texto acima');
        return;
      }

      const response = await fetch("https://elohim-oyeu.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
        credentials: "include",
      });

      if (response.status === 404 || response.status === 401) {
        setError("Usuário e/ou senha não encontrado");
        return;
      }

      if (response.status === 400) {
        setError("Preencha os campos de texto acima");
        return;
      }

      if (response.status === 500) {
        setError("Erro interno no servidor. Tente novamente mais tarde.");
        return;
      }

      if (response.ok) {
        const data = await response.json();

        // Salva no estado global do contexto
        setUserlog(data);

        // Se o backend retornar o token via JSON, salva no localStorage para requisições com Bearer
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        setSucess("Usuário logado com sucesso");
        toast.success("Usuário logado com sucesso");

        // Redireciona para o painel
        navigate("/painel");
      } else {
        setError("Falha ao realizar o login");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor");
    }
  }

  return (
    <div className="login">
      <form className="login-box" onSubmit={submit} noValidate>
        <div className="login-brand">
          <div className="brand-mark-container">
            <img 
              src="/icon-elohim.png" 
              alt="Logo Elohim" 
              className="brand-mark-img" 
            />
          </div>
          <span className="brand-name">Elohim</span>
          <span className="brand-sub">SISTEMA MINISTERIAL</span>
        </div>

        <label htmlFor="user">USUÁRIO</label>
        <input 
          id="user" 
          value={user} 
          onChange={event => setUser(event.target.value)} 
          required 
          placeholder="Digite seu usuário" 
          autoComplete="username" 
        />

        <label htmlFor="password">SENHA</label>
        <input 
          id="password" 
          value={password} 
          onChange={event => setPassword(event.target.value)} 
          required 
          type="password" 
          placeholder="Digite sua senha" 
          autoComplete="current-password" 
        />

        {error && <p className="form-error" role="alert">{error}</p>}
        {sucess && <p className="form-sucess" style={{ color: 'green' }}>{sucess}</p>}

        <button className="primary" type="submit">ENTRAR</button>
        <p className="muted login-note">Acesso seguro do ministério.</p>
      </form>
    </div>
  );
}