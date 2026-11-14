import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { permissaoDeNotificacaoNegada } from './servico';

// Reavalia ao voltar para o app, já que a pessoa pode ter mudado a permissão nas configurações do aparelho.
export function useNotificacoesNegadas(): boolean {
  const [negadas, setNegadas] = useState(false);

  useEffect(() => {
    const verificar = () => void permissaoDeNotificacaoNegada().then(setNegadas);
    verificar();
    const assinatura = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') {
        verificar();
      }
    });
    return () => assinatura.remove();
  }, []);

  return negadas;
}
