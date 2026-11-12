import { useCallback, useState } from 'react';

// O gesto de puxar para atualizar tem estado próprio: as atualizações automáticas não devem acionar o indicador.
export function useAtualizacaoManual(atualizar: () => Promise<unknown>) {
  const [atualizando, setAtualizando] = useState(false);

  const aoAtualizar = useCallback(async () => {
    setAtualizando(true);
    try {
      await atualizar();
    } finally {
      setAtualizando(false);
    }
  }, [atualizar]);

  return { atualizando, aoAtualizar };
}
