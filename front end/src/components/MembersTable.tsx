import { membersTypes } from "../types/Member";
import { useNavigate } from "react-router-dom";

interface MembersTableProps {
  members?: membersTypes[];
  isLoading?: boolean;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onView?: (member: membersTypes) => void; // ⬅️ Prop de visualização adicionada
  onEdit?: (member: membersTypes) => void;
  onDelete?: (id: string | number) => void;
}

export function MembersTable({
  members = [],
  isLoading = false,
  searchTerm = '',
  onSearchChange,
  onView,
  onEdit,
  onDelete,
}: MembersTableProps) {

  const navigate = useNavigate();

  const handleView = (member: membersTypes) => {
    onView?.(member);
    navigate(`/membro/${member.id}`); // ⬅️ Redireciona para a tela de detalhes
  };

  const handleEdit = (member: membersTypes) => {
    onEdit?.(member);
    navigate(`/editar-membro/${member.id}`);
  };

  return (
    <div className="table-card">
      {/* Barra de Ferramentas Superior */}
      <div className="table-toolbar">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Buscar por nome ou cargo..."
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
      </div>

      {/* Conteúdo da Tabela */}
      <div className="table-wrapper">
        <table className="pro-table">
          <thead>
            <tr>
              <th>NOME</th>
              <th>SOBRENOME</th>
              <th>DATA NASC.</th>
              <th>ESTADO CIVIL</th>
              <th>CARGO ECLES.</th>
              <th className="text-right">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="table-state-cell">
                  A carregar membros...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-state-cell">
                  Nenhum membro encontrado.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="member-name-cell">
                      <div className="avatar-circle"></div>
                      <span className="full-name">{member.nome}</span>
                    </div>
                  </td>
                  <td>{member.sobrenome}</td>
                  <td>{member.datanasc}</td>
                  <td>{member.estadocivil}</td>
                  <td>
                    <span className="cargo-badge">{member.cargoecle}</span>
                  </td>
                  <td className="text-right">
                    <div className="actions-wrapper">
                      {/* Botão Visualizar */}
                      <button
                        className="btn-action"
                        title="Visualizar"
                        onClick={() => handleView(member)}
                      >
                        👁️
                      </button>

                      {/* Botão Editar */}
                      <button
                        className="btn-action"
                        title="Editar"
                        onClick={() => handleEdit(member)}
                      >
                        ✏️
                      </button>

                      {/* Botão Eliminar */}
                      <button
                        className="btn-action btn-delete"
                        title="Eliminar"
                        onClick={() => onDelete?.(member.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}