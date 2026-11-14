import { createNavigationContainerRef } from '@react-navigation/native';
import type { PilhaPrincipalParams } from './tipos';

export const referenciaDeNavegacao = createNavigationContainerRef<PilhaPrincipalParams>();

export function abrirDetalheDoAlerta(eventoId: number) {
  if (referenciaDeNavegacao.isReady()) {
    referenciaDeNavegacao.navigate('DetalheDoAlerta', { eventoId });
  }
}
