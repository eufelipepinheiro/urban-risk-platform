import { useQuery } from '@tanstack/react-query';
import { INTERVALO_DE_ATUALIZACAO_MS } from '../api/config';
import { listarEventos } from '../api/servicos';

export function useEventos() {
  return useQuery({
    queryKey: ['eventos'],
    queryFn: ({ signal }) => listarEventos(signal),
    refetchInterval: INTERVALO_DE_ATUALIZACAO_MS,
  });
}
