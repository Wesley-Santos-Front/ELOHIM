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

  console.log(document.cookie);

  async function submit(event: FormEvent) {
    event.preventDefault()
    try {
      if (!user.trim() || !password.trim()) {
        setError('Preencha os campos de texto acima')
        return;
      }
      const response = await fetch("https://elohim-oyeu.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
        credentials: "include",
      });
      if (response.status === 404) {
        setError("Usuário e/ou senha não encontrado");
        return;
      }
      if (response.status === 400) {
        setError("Preencha os campos de texto acima");
        return;
      }
      if (response.status === 200) {
        setError("");
        setSucess("Usuário logado com sucesso")
        const data = await response.json();
        setUserlog(data);
        toast.success("Usuário logado com sucesso");
        navigate("/painel");
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }

  return (
    <div className="login">
      <form className="login-box" onSubmit={submit} noValidate>
        <div className="login-brand">
          {/* Imagem do ícone no lugar do span com 'E' */}
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

        <button className="primary" type="submit">ENTRAR</button>
        <p className="muted login-note">Acesso seguro do ministério.</p>
      </form>
    </div>
  )
}