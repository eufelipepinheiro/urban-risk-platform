import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useStatusDaConexao } from '../hooks/useStatusDaConexao';
import type { StatusDaConexao } from '../hooks/useStatusDaConexao';

const ContextoDeConexao = createContext<StatusDaConexao | null>(null);

export function ProvedorDeConexao({ children }: { children: ReactNode }) {
  const status = useStatusDaConexao();
  return <ContextoDeConexao.Provider value={status}>{children}</ContextoDeConexao.Provider>;
}

export function useConexao(): StatusDaConexao {
  const status = useContext(ContextoDeConexao);
  if (status === null) {
    throw new Error('useConexao deve ser usado dentro de ProvedorDeConexao');
  }
  return status;
}
