import { useQuery } from '@tanstack/react-query';
import { INTERVALO_DE_ATUALIZACAO_MS } from '../api/config';
import { listarAlertas } from '../api/servicos';

export function useAlertas() {
  return useQuery({
    queryKey: ['alertas'],
    queryFn: ({ signal }) => listarAlertas(signal),
    refetchInterval: INTERVALO_DE_ATUALIZACAO_MS,
  });
}
