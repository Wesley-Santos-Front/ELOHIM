import { useState, useEffect, useMemo, FormEvent } from 'react';
import { Shell, PageHeader } from '../components/Shell';

interface Member {
  id: string | number;
  nome: string;
  sobrenome: string;
  cargoEcles?: string;
  cargoecle?: string;
}

export default function Recommendation() {
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [recipient, setRecipient] = useState('');
  const [pastor, setPastor] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/busca", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setMembers(data);
        }
      } catch (error) {
        console.error("Erro ao carregar membros:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMembers();
  }, []);

  const hoje = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  }, []);

  function handleSelectMember(id: string) {
    if (!id) {
      setName('');
      setRole('');
      return;
    }

    const member = members.find((m) => String(m.id) === String(id));
    if (member) {
      setName(`${member.nome} ${member.sobrenome}`);
      setRole(member.cargoEcles || member.cargoecle || "Membro");
    }
  }

  function handlePrint(e: FormEvent) {
    e.preventDefault();
    window.print();
  }

  return (
    <Shell>
      <section className="content">
        <PageHeader 
          eyebrow="DOCUMENTO" 
          title="Carta de Recomendação" 
          description="Preencha os campos e visualize a carta oficial do ministério." 
        />

        <div className="two-col recommendation-layout">
          {/* Formulário (Ocultado na Impressão) */}
          <form className="card form-card" onSubmit={handlePrint}>
            <h2 className="text-xl font-serif mb-4">DADOS DA CARTA</h2>

            <div className="form-field">
              <label htmlFor="select-member">SELECIONAR MEMBRO (OPCIONAL)</label>
              <select 
                id="select-member" 
                onChange={(e) => handleSelectMember(e.target.value)}
                disabled={isLoading}
              >
                <option value="">
                  {isLoading ? "Carregando..." : "— Selecione para preencher —"}
                </option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome} {m.sobrenome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="rec-name">NOME COMPLETO *</label>
              <input 
                id="rec-name" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Ex.: Graziela Nunes de Castro"
              />
            </div>

            <div className="form-field">
              <label htmlFor="rec-role">CARGO ECLESIÁSTICO *</label>
              <input 
                id="rec-role" 
                required 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                placeholder="Ex.: Diácono"
              />
            </div>

            <div className="form-field">
              <label htmlFor="recipient">DESTINATÁRIO (OPCIONAL)</label>
              <input 
                id="recipient" 
                value={recipient} 
                onChange={(e) => setRecipient(e.target.value)} 
                placeholder="Ex.: Igreja Filial Central" 
              />
            </div>

            <div className="form-field">
              <label htmlFor="pastor">ASSINATURA — PASTOR / RESPONSÁVEL</label>
              <input 
                id="pastor" 
                value={pastor} 
                onChange={(e) => setPastor(e.target.value)} 
                placeholder="Ex.: Pr. Roberto Souza" 
              />
            </div>

            <button className="primary" type="submit" disabled={!name || !role}>
              IMPRIMIR / SALVAR PDF
            </button>
          </form>

          {/* Área de Impressão */}
          <article className="card recommendation-preview">
            <div className="doc-header">
              <img 
                src="/icon-elohim.png" 
                alt="Logo Ministério Elohim" 
                className="doc-logo"
              />
              <h2 className="doc-brand">Ministério Elohim</h2>
              <hr className="doc-divider" />
              <h3 className="doc-title">Carta de Recomendação</h3>
            </div>

            <div className="doc-body">
              {recipient && (
                <p className="doc-recipient">Aos irmãos da igreja {recipient},</p>
              )}

              <p className="doc-paragraph">
                Recomendamos, por meio desta carta, o(a) membro(a){" "}
                <strong>
                  {name || '___________________________'}
                </strong>
                , que exerce o cargo de{" "}
                <strong>
                  {role || '___________________________'}
                </strong>{" "}
                em nosso ministério, estando em plena comunhão e apto(a) para todas as atividades cristãs conforme as Escrituras Sagradas.
              </p>

              <p className="doc-paragraph">
                Atestamos sua idoneidade moral e espiritual, pedindo que seja recebido(a) com a fraternidade cristã que lhe é devida.
              </p>

              {/* Versículo neutro acrescentado */}
              <blockquote className="doc-verse">
                "É nosso companheiro e cooperador para convosco... são mensageiros das igrejas e glória de Cristo."
                <span className="doc-verse-ref">— 2 Coríntios 8:23</span>
              </blockquote>
            </div>

            <div className="doc-footer">
              <p className="doc-date">{hoje}</p>

              <div className="doc-signature">
                <p className="doc-pastor-name">
                  {pastor || "Pastor Responsável"}
                </p>
                <p className="doc-pastor-role">
                  Ministério Elohim
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Regras CSS de Impressão de Folha A4 Completa */}
      <style>{`
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-bottom: 1rem;
        }

        /* Visualização na Tela */
        .recommendation-preview {
          background-color: #ffffff;
          color: #1a1a1a;
          padding: 3rem 2.5rem;
          border-radius: 8px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          font-family: 'Times New Roman', Times, serif;
        }

        .doc-header {
          text-align: center;
        }

        .doc-logo {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          object-fit: cover;
          margin: 0 auto 0.75rem auto;
          display: block;
        }

        .doc-brand {
          font-size: 1.6rem;
          font-weight: bold;
          margin: 0;
          color: #111827;
        }

        .doc-divider {
          border: 0;
          border-top: 1px solid #d1d5db;
          margin: 1.5rem 0;
        }

        .doc-title {
          font-size: 1.35rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 2rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .doc-body {
          font-size: 1.1rem;
          line-height: 2;
          color: #374151;
        }

        .doc-recipient {
          font-style: italic;
          margin-bottom: 1.5rem;
          color: #4b5563;
        }

        .doc-paragraph {
          margin-bottom: 1.5rem;
          text-align: justify;
        }

        .doc-paragraph strong {
          color: #111827;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .doc-verse {
          margin: 2rem 1.5rem;
          padding-left: 1rem;
          border-left: 3px solid #9ca3af;
          font-style: italic;
          color: #4b5563;
          font-size: 1rem;
          line-height: 1.6;
        }

        .doc-verse-ref {
          display: block;
          margin-top: 0.5rem;
          font-weight: bold;
          font-style: normal;
          font-size: 0.9rem;
          color: #374151;
        }

        .doc-footer {
          text-align: center;
          margin-top: 3rem;
        }

        .doc-date {
          font-size: 1rem;
          color: #4b5563;
          margin-bottom: 3rem;
        }

        .doc-signature {
          width: 280px;
          margin: 0 auto;
          border-top: 1px solid #6b7280;
          padding-top: 0.5rem;
        }

        .doc-pastor-name {
          font-size: 1rem;
          font-weight: bold;
          color: #111827;
          margin: 0;
        }

        .doc-pastor-role {
          font-size: 0.8rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }

        /* REGRAS ESTRITAS DE IMPRESSÃO EM A4 (1 PÁGINA) */
        @media print {
          @page {
            size: A4 portrait;
            margin: 1.5cm 1.5cm 1.5cm 1.5cm;
          }

          aside, nav, header, .form-card, .eyebrow, h1, .muted, button {
            display: none !important;
          }

          html, body, .app-shell, .main, .content, .two-col, .recommendation-layout {
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            display: block !important;
            box-shadow: none !important;
          }

          .recommendation-preview {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            height: 25.5cm !important;
            box-sizing: border-box !important;
          }

          .doc-logo {
            width: 100px;
            height: 100px;
            margin-bottom: 1rem;
          }

          .doc-brand {
            font-size: 2.2rem;
          }

          .doc-title {
            font-size: 1.6rem;
            margin-bottom: 2rem;
          }

          .doc-body {
            font-size: 1.2rem;
            line-height: 2;
          }

          .doc-paragraph {
            margin-bottom: 1.5rem;
          }

          .doc-verse {
            margin: 2rem 2rem;
            font-size: 1.1rem;
          }

          .doc-date {
            font-size: 1.1rem;
            margin-bottom: 3.5rem;
          }

          .doc-signature {
            width: 320px;
          }

          .doc-pastor-name {
            font-size: 1.15rem;
          }
        }
      `}</style>
    </Shell>
  );
}