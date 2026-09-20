import { useEffect, useState } from 'react';
import { Shell, PageHeader } from '../components/Shell';
import { MembersTable } from '../components/MembersTable';
import { membersTypes } from '../types/Member';
import toast from 'react-hot-toast';

export default function Members() {
  const [members, setMembers] = useState<membersTypes[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Função auxiliar para formatar a data ignorando o fuso horário (UTC offset)
  const formatDataSemFuso = (dataString?: string) => {
    if (!dataString) return '-';

    // Pega apenas a parte "YYYY-MM-DD"
    const [dataPart] = dataString.split('T');
    const parts = dataPart.split('-');

    if (parts.length !== 3) return '-';

    const [ano, mes, dia] = parts;
    return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
  };

  // 1. Busca os membros na API
  const getMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/busca", {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Erro ao buscar a lista de membros");
      }

      const data = await response.json();

      // Formata os dados alinhando com a interface membersTypes
      const formattedData: membersTypes[] = data.map((item: any) => ({
        ...item, // Preserva as restantes propriedades do membro
        id: item.id,
        nome: item.nome,
        sobrenome: item.sobrenome,
        datanasc: formatDataSemFuso(item.datanasc), // ✅ Corrigido aqui
        estadocivil: item.estadocivil,
        cargoecle: item.cargoecles || item.cargoecle,
      }));

      setMembers(formattedData);
    } catch (error: any) {
      console.error("Erro no fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

  // 2. Filtro local em tempo real
  const filteredMembers = members.filter((m) => {
    const term = searchTerm.toLowerCase();
    return (
      m.nome?.toLowerCase().includes(term) ||
      m.cargoecle?.toLowerCase().includes(term)
    );
  });

  // 3. Handlers para Ações
  const handleEdit = (member: membersTypes) => {
    console.log("Editar membro:", member);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Tem certeza que deseja remover este membro?")) return;

    try {
      const response = await fetch(`http://localhost:3000/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Membro removido com sucesso!");
        setMembers((prev) => prev.filter((m) => m.id !== id));
      } else {
        toast.error("Erro ao remover membro.");
      }
    } catch (error) {
      toast.error("Erro de conexão ao remover membro.");
    }
  };

  return (
    <Shell>
      <section className="content">
        <PageHeader 
          eyebrow="CADASTRO" 
          title="Membros" 
          description={`${members.length} membro(s) cadastrado(s).`} 
        />
        
        <MembersTable 
          members={filteredMembers}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>
    </Shell>                   
  );
}