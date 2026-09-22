import { Link } from 'react-router-dom';
import { PageHeader, Shell } from '../components/Shell';
import { UserContext } from '../contexts/UserContext';
import { useContext, useEffect, useState } from 'react';
import { membersTypes } from '../types/Member';

export default function Dashboard() {
  const { userLog } = useContext(UserContext);
  const [memb, setMemb] = useState<membersTypes[]>([]);

  // 1. Busca os membros na API enviando o Token
  const getMemberstot = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://elohim-oyeu.onrender.com/busca", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // 👈 ADICIONADO: Envia o token para o authMiddleware
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erro ao encontrar os membros");
      }

      const data = await response.json();

      const formattedData: membersTypes[] = data.map((item: any) => ({
        ...item,
        cargoecle: item.cargoecles || item.cargoecle,
      }));

      setMemb(formattedData);
    } catch (error) {
      console.error("Erro no fetch: ", error);
    }
  };

  useEffect(() => {
    getMemberstot();
  }, []);

  // 2. Filtro de Obreiros
  const obreirosList = memb.filter(
    (item) => item.cargoecle?.trim().toLowerCase() !== "membro"
  );

  // 3. Cadastros Recentes (Pega os 2 últimos pelo ID)
  const cadastrosRecentes = [...memb]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 2);

  // 4. Filtro e Formatação de Aniversariantes do Mês
  const mesAtual = new Date().getMonth();

  const aniversariantesDoMes = memb
    .filter((item) => {
      if (!item.datanasc) return false;
      const [dataPart] = item.datanasc.split('T');
      const [, mes] = dataPart.split('-');
      return parseInt(mes, 10) - 1 === mesAtual;
    })
    .map((item) => {
      const [dataPart] = item.datanasc!.split('T');
      const [, mes, dia] = dataPart.split('-').map(Number);

      const diaFormatado = String(dia).padStart(2, '0');
      const mesFormatado = String(mes).padStart(2, '0');

      return {
        ...item,
        dataFormatada: `${diaFormatado}/${mesFormatado}`,
        dia: dia,
      };
    })
    .sort((a, b) => a.dia - b.dia);

  // 5. Métricas para os Cards
  const totalMembros = memb.length;
  const totalObreiros = obreirosList.length;
  const totalAniversariantes = aniversariantesDoMes.length;

  const dashboardCards = [
    { label: 'MEMBROS', value: totalMembros },
    { label: 'OBREIROS', value: totalObreiros },
    { label: 'ANIVERSARIANTES DO MÊS', value: totalAniversariantes },
  ];

  return (
    <Shell>
      <section className="content">
        <p className="text-white">{userLog?.usuario}</p>
        
        <PageHeader 
          eyebrow="BEM-VINDO" 
          title="Painel Ministerial" 
          description="Visão geral do ministério: membros cadastrados, obreiros e aniversariantes deste mês." 
        />

        <div className="grid">
          {dashboardCards.map((card) => (
            <div className="card" key={card.label}>
              <div className="card-label">{card.label}</div>
              <div className="card-value">{card.value}</div>
            </div>
          ))}
        </div>

        <div className="two-col">
          {/* Card Cadastros Recentes */}
          <div className="card">
            <div className="card-head">
              <h2>Cadastros recentes</h2>
              <Link className="gold-link" to="/membros">VER TODOS</Link>
            </div>

            {totalMembros === 0 ? (
              <div className="empty">
                Nenhum membro cadastrado ainda.{" "}
                <Link className="gold-link" to="/novo-cadastro">Cadastrar agora</Link>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="pro-table">
                  <thead>
                    <tr>
                      <th>NOME</th>
                      <th>CARGO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cadastrosRecentes.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <div className="member-name-cell">
                            <span className="full-name">{member.nome} {member.sobrenome}</span>
                          </div>
                        </td>
                        <td>
                          <span className="cargo-badge">{member.cargoecle || 'Membro'}</span>
                        </td>
                      </tr>
                    ))}

                    {totalMembros > 2 && (
                      <tr>
                        <td colSpan={2} style={{ textAlign: 'center', opacity: 0.6, padding: '8px 0' }}>
                          ...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Card Aniversariantes do Mês */}
          <div className="card">
            <div className="card-head">
              <h2>Aniversariantes do mês</h2>
              <Link className="gold-link" to="/aniversariantes">VER TODOS</Link>
            </div>

            {totalAniversariantes === 0 ? (
              <div className="empty">Nenhum aniversariante este mês.</div>
            ) : (
              <div className="table-wrapper">
                <table className="pro-table">
                  <thead>
                    <tr>
                      <th>NOME</th>
                      <th>DATA ANIVER.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aniversariantesDoMes.slice(0, 2).map((member) => (
                      <tr key={member.id}>
                        <td>
                          <div className="member-name-cell">
                            <span className="full-name">{member.nome} {member.sobrenome}</span>
                          </div>
                        </td>
                        <td>{member.dataFormatada}</td>
                      </tr>
                    ))}

                    {totalAniversariantes > 2 && (
                      <tr>
                        <td colSpan={2} style={{ textAlign: 'center', opacity: 0.6, padding: '8px 0' }}>
                          ...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </Shell>
  );
}