import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shell, PageHeader } from '../components/Shell';
import toast from 'react-hot-toast';

export default function ViewMember() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Formatação de data (DD/MM/AAAA)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não informado";
    const cleanDate = dateString.split('T')[0];
    const [year, month, day] = cleanDate.split('-');
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/busca", {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Erro ao carregar os dados");

        const data = await response.json();
        const foundMember = data.find((m: any) => String(m.id) === String(id));

        if (foundMember) {
          setMember(foundMember);
        } else {
          toast.error("Membro não encontrado!");
          navigate("/membros");
        }
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar os detalhes do membro.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchMemberData();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <Shell>
        <section className="content">
          <p>Carregando informações do membro...</p>
        </section>
      </Shell>
    );
  }

  if (!member) return null;

  return (
    <Shell>
      <section className="content">
        <PageHeader 
          eyebrow="DETALHES DO MEMBRO" 
          title={`${member.nome} ${member.sobrenome}`} 
          description="Informações cadastradas no sistema." 
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

        <div className="card form-card">
          {/* SEÇÃO 1: DADOS PESSOAIS */}
          <h2>DADOS PESSOAIS</h2>
          <div className="form-grid">
            <div>
              <label>NOME COMPLETO</label>
              <p className="detail-value">{member.nome} {member.sobrenome}</p>
            </div>
            <div>
              <label>DATA DE NASCIMENTO</label>
              <p className="detail-value">{formatDate(member.datanasc)}</p>
            </div>
            <div>
              <label>SEXO</label>
              <p className="detail-value">{member.sexo || "Não informado"}</p>
            </div>
            <div>
              <label>ESTADO CIVIL</label>
              <p className="detail-value">{member.estadocivil || "Não informado"}</p>
            </div>
            <div>
              <label>CÔNJUGE</label>
              <p className="detail-value">{member.conjugue || "Não informado"}</p>
            </div>
            <div>
              <label>PROFISSÃO</label>
              <p className="detail-value">{member.profissao || "Não informado"}</p>
            </div>
            <div>
              <label>CPF</label>
              <p className="detail-value">{member.cpf || "Não informado"}</p>
            </div>
            <div>
              <label>RG</label>
              <p className="detail-value">{member.rg || "Não informado"}</p>
            </div>
          </div>

          <br /><br />

          {/* SEÇÃO 2: CONTATO */}
          <h2>CONTATO</h2>
          <div className="form-grid">
            <div>
              <label>TELEFONE FIXO</label>
              <p className="detail-value">{member.telefone || "Não informado"}</p>
            </div>
            <div>
              <label>CELULAR (WHATSAPP)</label>
              <p className="detail-value">{member.celular || "Não informado"}</p>
            </div>
            <div>
              <label>E-MAIL</label>
              <p className="detail-value">{member.email || "Não informado"}</p>
            </div>
          </div>

          <br /><br />

          {/* SEÇÃO 3: ENDEREÇO */}
          <h2>ENDEREÇO</h2>
          <div className="form-grid">
            <div>
              <label>RUA / LOGRADOURO</label>
              <p className="detail-value">{member.rua || "Não informado"}</p>
            </div>
            <div>
              <label>NÚMERO</label>
              <p className="detail-value">{member.numero || "S/N"}</p>
            </div>
            <div>
              <label>BAIRRO</label>
              <p className="detail-value">{member.bairro || "Não informado"}</p>
            </div>
            <div>
              <label>CIDADE</label>
              <p className="detail-value">{member.cidade || "Não informado"}</p>
            </div>
            <div>
              <label>CEP</label>
              <p className="detail-value">{member.cep || "Não informado"}</p>
            </div>
            <div>
              <label>ESTADO</label>
              <p className="detail-value">{member.estado || "Não informado"}</p>
            </div>
          </div>

          <br /><br />

          {/* SEÇÃO 4: DADOS ECLESIÁSTICOS */}
          <h2>DADOS ECLESIÁSTICOS</h2>
          <div className="form-grid">
            <div>
              <label>CARGO ECLESIÁSTICO</label>
              <p className="detail-value">
                <span className="cargo-badge">
                  {member.cargoecles || member.cargoecle || "Membro"}
                </span>
              </p>
            </div>
            <div>
              <label>IGREJA DE BATISMO</label>
              <p className="detail-value">{member.igrejabat || "Não informado"}</p>
            </div>
            <div>
              <label>DATA DE BATISMO</label>
              <p className="detail-value">{formatDate(member.databat)}</p>
            </div>
            <div className="full">
              <label>OBSERVAÇÕES</label>
              <p className="detail-value">{member.obs || "Nenhuma observação cadastrada."}</p>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}