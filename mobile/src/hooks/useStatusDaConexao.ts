import { useCallback, useEffect, useMemo, useState } from 'react';
import { ErroDeApi } from '../api/cliente';
import type { CausaDoErro } from '../api/cliente';
import { useAlertas } from './useAlertas';

export type EstadoDaConexao = 'conectado' | 'desconectado' | 'reconectado';

export interface StatusDaConexao {
  estado: EstadoDaConexao;
  causa: CausaDoErro | undefined;
  ultimaAtualizacao: number;
  tentarAgora: () => void;
}

const DURACAO_DO_AVISO_DE_RECONEXAO_MS = 4000;

export function proximoEstadoDaConexao(anterior: EstadoDaConexao, houveFalha: boolean): EstadoDaConexao {
  if (houveFalha) {
    return 'desconectado';
  }
  return anterior === 'desconectado' ? 'reconectado' : anterior;
}

// A conexão é inferida da própria consulta de alertas, que já roda a cada ciclo: não há requisições extras.
export function useStatusDaConexao(): StatusDaConexao {
  const consulta = useAlertas();
  const [estado, setEstado] = useState<EstadoDaConexao>('conectado');

  useEffect(() => {
    setEstado((anterior) => proximoEstadoDaConexao(anterior, consulta.isError));
  }, [consulta.isError]);

  useEffect(() => {
    if (estado !== 'reconectado') {
      return;
    }
    const temporizador = setTimeout(() => setEstado('conectado'), DURACAO_DO_AVISO_DE_RECONEXAO_MS);
    return () => clearTimeout(temporizador);
  }, [estado]);

  const { refetch } = consulta;
  const tentarAgora = useCallback(() => {
    void refetch();
  }, [refetch]);

  const causa = consulta.error instanceof ErroDeApi ? consulta.error.causa : undefined;

  return useMemo(
    () => ({ estado, causa, ultimaAtualizacao: consulta.dataUpdatedAt, tentarAgora }),
    [estado, causa, consulta.dataUpdatedAt, tentarAgora],
  );
}
