import { Shell, PageHeader } from '../components/Shell';
import { membersTypes } from '../types/Member';
import { useState, useEffect } from 'react';

export default function Birthdays() { 
  const [memb, setMemb] = useState<membersTypes[]>([]);

  // 1. Busca os membros na API
  const getMebersBirt = async () => {
    try {
      const response = await fetch("http://localhost:3000/busca", {
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
    getMebersBirt();
  }, []);

  // 2. Filtro e Formatação de Aniversariantes do Mês (Sem alteração por fuso)
  const mesAtual = new Date().getMonth(); // 0 = Jan, 8 = Set, etc.

  const aniversariantesDoMes = memb
    .filter((item) => {
      if (!item.datanasc) return false;

      // Extrai apenas a parte "YYYY-MM-DD"
      const [dataPart] = item.datanasc.split('T');
      const [, mes] = dataPart.split('-');

      // Compara o mês (subtrai 1 pois no Date do JS os meses vão de 0 a 11)
      return parseInt(mes, 10) - 1 === mesAtual;
    })
    .map((item) => {
      // Separa ano, mês e dia como números inteiros
      const [dataPart] = item.datanasc!.split('T');
      const [ano, mes, dia] = dataPart.split('-').map(Number);

      // Formata o dia e o mês com zero à esquerda (ex: 08 e 09)
      const diaFormatado = String(dia).padStart(2, '0');
      const mesFormatado = String(mes).padStart(2, '0');

      return {
        ...item,
        dataFormatada: `${diaFormatado}/${mesFormatado}`,
        dia: dia,
      };
    })
    .sort((a, b) => a.dia - b.dia);

  const totalAniversariantes = aniversariantesDoMes.length;

  return (
    <Shell>
      <section className="content">
        <PageHeader 
          eyebrow="CELEBRAÇÃO" 
          title="Aniversariantes" 
          description={`${totalAniversariantes} aniversariante(s) neste mês.`} 
        />

        {totalAniversariantes === 0 ? (
          <div className="card birthdays-card">
            <div className="empty">Nenhum aniversariante este mês.</div>
          </div>
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
                {aniversariantesDoMes.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="member-name-cell">
                        <span className="full-name">{member.nome} {member.sobrenome}</span>
                      </div>
                    </td>
                    <td>{member.dataFormatada}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Shell>
  );
}