// src/types/global.d.ts

// Tipos para as variáveis de ambiente do Vite
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Suas interfaces do sistema acessíveis globalmente
interface UserInterface {
  id: string;
  name: string;
  role: string;
}