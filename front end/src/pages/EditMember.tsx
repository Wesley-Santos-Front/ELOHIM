import { FormEvent, useState, useEffect } from 'react';
import { Shell, PageHeader } from '../components/Shell';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast'; 

export default function EditMember() {
  const { id } = useParams(); // 1. Resgata o id da URL (/editar-membro/:id)
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [sucess, setSucess] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState({
    nome: "", 
    sobrenome: "", 
    dataNascimento: "", 
    sexo: "", 
    estadoCivil: "", 
    conjugue: "", 
    profissao: "", 
    cpf: "", 
    rg: "", 
    telefone: "", 
    celular: "", 
    email: "", 
    rua: "", 
    numero: "", 
    bairro: "", 
    cidade: "", 
    cep: "", 
    estado: "", 
    cargoEcles: "", 
    igrejaBat: "", 
    dataBat: "", 
    obs: "",
  });

  // =========================================================
  // FUNÇÕES DE MÁSCARAS (FORMATADORES)
  // =========================================================
  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const maskRG = (value: string) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 10)
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 10)
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  };

  const maskCell = (value: string) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const maskCEP = (value: string) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 8)
      .replace(/^(\d{5})(\d)/, "$1-$2");
  };

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    return dateString.split('T')[0]; // Garante o formato YYYY-MM-DD exigido pelo <input type="date">
  };

  // 2. Busca os dados do membro ao carregar a página
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/busca", {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Erro ao carregar os dados");

        const data = await response.json();
        const member = data.find((m: any) => String(m.id) === String(id));

        if (member) {
          setForm({
            nome: member.nome || "",
            sobrenome: member.sobrenome || "",
            dataNascimento: formatDateForInput(member.datanasc),
            sexo: member.sexo || "",
            estadoCivil: member.estadocivil || "",
            conjugue: member.conjugue || "",
            profissao: member.profissao || "",
            cpf: member.cpf ? maskCPF(member.cpf) : "",
            rg: member.rg ? maskRG(member.rg) : "",
            telefone: member.telefone ? maskPhone(member.telefone) : "",
            celular: member.celular ? maskCell(member.celular) : "",
            email: member.email || "",
            rua: member.rua || "",
            numero: member.numero || "",
            bairro: member.bairro || "",
            cidade: member.cidade || "",
            cep: member.cep ? maskCEP(member.cep) : "",
            estado: member.estado || "",
            cargoEcles: member.cargoecles || member.cargoecle || "",
            igrejaBat: member.igrejabat || "",
            dataBat: formatDateForInput(member.databat),
            obs: member.obs || "",
          });
        } else {
          toast.error("Membro não encontrado!");
          navigate("/membros");
        }
      } catch (err) {
        toast.error("Erro ao carregar dados do membro.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchMemberData();
  }, [id, navigate]);

  const CARGOS = [
    "Membro",
    "Diácono",
    "Obreiro",
    "Presbítero",
    "Evangelista",
    "Missionário",
    "Pastor",
  ];

  const ESTADOS_CIVIS = [
    "Solteiro(a)", 
    "Casado(a)", 
    "Divorciado(a)", 
    "Viúvo(a)", 
    "União Estável",
  ];

  const SEXO = [
    "Masculino", 
    "Feminino", 
  ];

  const ESTADO = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  const setField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSucess("");

    try {
      // 3. Atualiza com PUT passando a ID na URL
      const response = await fetch(`http://localhost:3000/editar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form)
      });

      if (response.status === 400) {
        setError("Verifique se os campos obrigatórios encontram-se preenchidos");
        toast.error("Erro: verifique se os campos obrigatórios estão preenchidos");
        return;
      }

      if (response.status === 409) {
        setError("CPF já pertence a outro membro!");
        toast.error("Erro: CPF já pertence a outro membro no sistema!");
        return;
      }

      if (response.status === 500) {
        setError("Erro ao tentar atualizar, tente novamente mais tarde!");
        toast.error("Erro ao tentar atualizar, tente novamente mais tarde!");
        return;
      }

      if (response.ok) {
        setSucess("Membro atualizado com sucesso!");
        toast.success("Membro atualizado com sucesso!");
        navigate("/membros");
      }
    } catch (err: any) {
      setError(err.message || "Erro de conexão com o servidor");
      toast.error("Erro de conexão com o servidor");
    }
  }

  if (isLoading) {
    return (
      <Shell>
        <section className="content">
          <p>A carregar dados do membro...</p>
        </section>
      </Shell>
    );
  }

  return (
    <Shell>
      <section className="content">
        <PageHeader 
          eyebrow="EDIÇÃO" 
          title="Editar Membro" 
          description="Altere os dados necessários e clique em Salvar." 
        />
        {/* Barra de Ações Rápidas */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button 
            type="button" 
            className="secondary" 
            onClick={() => navigate(-1)}
          >
            ← Voltar
          </button>
        </div>
        <form className="card form-card" onSubmit={onSubmit}>
          {error && <p className="form-error" role="alert">{error}</p>}
          
          <h2>DADOS PESSOAIS</h2>
          <div className="form-grid">
            {/* NOME */}
            <div>
              <label htmlFor="nome">NOME</label>
              <input
                type='text' 
                id="nome" 
                value={form.nome} 
                onChange={(e) => setField("nome", e.target.value)} 
                required 
              />
            </div>

            {/* SOBRENOME */}
            <div>
              <label htmlFor="sobrenome">SOBRENOME</label>
              <input 
                type='text'
                id="sobrenome" 
                value={form.sobrenome} 
                onChange={(e) => setField("sobrenome", e.target.value)} 
                required 
              />
            </div>

            {/* DATA DE NASCIMENTO */}
            <div>
              <label htmlFor="dataNascimento">DATA DE NASCIMENTO</label>
              <input 
                id="dataNascimento" 
                type="date"
                value={form.dataNascimento} 
                onChange={(e) => setField("dataNascimento", e.target.value)} 
                required 
              />
            </div>

            {/* SEXO */}
            <div>
              <label htmlFor="sexo">SEXO</label>
              <select 
                id="sexo"
                value={form.sexo} 
                onChange={(e) => setField("sexo", e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                {SEXO.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* ESTADO CIVIL */}
            <div>
              <label htmlFor="estadoCivil">ESTADO CIVIL</label>
              <select 
                id="estadoCivil"
                value={form.estadoCivil} 
                onChange={(e) => setField("estadoCivil", e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                {ESTADOS_CIVIS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* CONJUGE */}
            <div>
              <label htmlFor="conjugue">CÔNJUGE</label>
              <input 
                type='text'
                id="conjugue" 
                value={form.conjugue} 
                onChange={(e) => setField("conjugue", e.target.value)} 
              />
            </div>

            {/* PROFISSÃO */}
            <div>
              <label htmlFor="profissao">PROFISSÃO</label>
              <input 
                type='text'
                id="profissao" 
                value={form.profissao} 
                onChange={(e) => setField("profissao", e.target.value)} 
              />
            </div>

            {/* CPF COM MÁSCARA */}
            <div>
              <label htmlFor="cpf">CPF</label>
              <input
                type='text'
                id="cpf" 
                placeholder="000.000.000-00"
                value={form.cpf} 
                onChange={(e) => setField("cpf", maskCPF(e.target.value))} 
                required 
              />
            </div>

            {/* RG COM MÁSCARA */}
            <div>
              <label htmlFor="rg">RG</label>
              <input
                type='text'
                id="rg" 
                placeholder="00.000.000-0"
                value={form.rg} 
                onChange={(e) => setField("rg", maskRG(e.target.value))} 
              />
            </div>
          </div>

          <br /><br />

          <h2>CONTATO</h2>
          <div className="form-grid">
            {/* TELEFONE COM MÁSCARA */}
            <div>
              <label htmlFor="telefone">TELEFONE FIXO</label>
              <input 
                type='text'
                id="telefone" 
                placeholder="(00) 0000-0000"
                value={form.telefone} 
                onChange={(e) => setField("telefone", maskPhone(e.target.value))} 
              />
            </div>

            {/* CELULAR COM MÁSCARA */}
            <div>
              <label htmlFor="celular">CELULAR (WHATSAPP)</label>
              <input 
                type='text'
                id="celular" 
                placeholder="(00) 00000-0000"
                value={form.celular} 
                onChange={(e) => setField("celular", maskCell(e.target.value))} 
              />
            </div>

            {/* E-MAIL */}
            <div>
              <label htmlFor="email">E-MAIL</label>
              <input 
                type='email'
                id="email" 
                value={form.email} 
                onChange={(e) => setField("email", e.target.value)} 
              />
            </div>
          </div>

          <br /><br />

          <h2>ENDEREÇO</h2>
          <div className="form-grid">
            {/* RUA */}
            <div>
              <label htmlFor="rua">RUA</label>
              <input 
                type='text'
                id="rua" 
                value={form.rua} 
                onChange={(e) => setField("rua", e.target.value)} 
              />
            </div>

            {/* NUMERO */}
            <div>
              <label htmlFor="numero">NÚMERO</label>
              <input
                type='text'
                id="numero" 
                value={form.numero} 
                onChange={(e) => setField("numero", e.target.value)} 
              />
            </div>

            {/* BAIRRO */}
            <div>
              <label htmlFor="bairro">BAIRRO</label>
              <input 
                type='text'
                id="bairro" 
                value={form.bairro} 
                onChange={(e) => setField("bairro", e.target.value)} 
              />
            </div>

            {/* CIDADE */}
            <div>
              <label htmlFor="cidade">CIDADE</label>
              <input 
                type='text'
                id="cidade" 
                value={form.cidade} 
                onChange={(e) => setField("cidade", e.target.value)} 
              />
            </div>

            {/* CEP COM MÁSCARA */}
            <div>
              <label htmlFor="cep">CEP</label>
              <input 
                type='text'
                id="cep" 
                placeholder="00000-000"
                value={form.cep} 
                onChange={(e) => setField("cep", maskCEP(e.target.value))} 
              />
            </div>

            {/* ESTADO */}
            <div>
              <label htmlFor="estado">ESTADO</label>
              <select 
                id="estado"
                value={form.estado} 
                onChange={(e) => setField("estado", e.target.value)}
              >
                <option value="">Selecione...</option>
                {ESTADO.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <br /><br />

          <h2>DADOS ECLESIÁSTICOS</h2>
          <div className="form-grid">
            {/* CARGO */}
            <div>
              <label htmlFor="cargoEcles">CARGO</label>
              <select 
                id="cargoEcles"
                value={form.cargoEcles} 
                onChange={(e) => setField("cargoEcles", e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                {CARGOS.map((cargo) => (
                  <option key={cargo} value={cargo}>{cargo}</option>
                ))}
              </select>
            </div>

            {/* IGREJA DE BATISMO */}
            <div>
              <label htmlFor="igrejaBat">IGREJA DE BATISMO</label>
              <input 
                type='text'
                id="igrejaBat" 
                value={form.igrejaBat} 
                onChange={(e) => setField("igrejaBat", e.target.value)} 
              />
            </div>

            {/* DATA DE BATISMO */}
            <div>
              <label htmlFor="dataBat">DATA DE BATISMO</label>
              <input 
                id="dataBat" 
                type="date"
                value={form.dataBat} 
                onChange={(e) => setField("dataBat", e.target.value)} 
              />
            </div>

            {/* OBSERVAÇÃO */}
            <div className="full">
              <label htmlFor="obs">OBSERVAÇÕES</label>
              <input 
                id="obs" 
                value={form.obs}
                onChange={(e) => setField("obs", e.target.value)}
              />
            </div>
          </div>

          <button className="primary" type="submit">
            SALVAR ALTERAÇÕES
          </button>
        </form>
      </section>
    </Shell>
  );
}