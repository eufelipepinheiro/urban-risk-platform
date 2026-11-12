import { Ionicons } from '@expo/vector-icons';
import type { TipoEvento } from '../api/tipos';
import { cores } from '../tema/cores';
import type { NomeDeIcone } from '../tema/icones';

const ICONE_DO_TIPO: Record<TipoEvento, NomeDeIcone> = {
  ALAGAMENTO: 'water',
  ILHA_DE_CALOR: 'thermometer',
  INTERRUPCAO_SERVICO: 'flash-off',
};

interface Props {
  tipo: TipoEvento;
  tamanho?: number;
  cor?: string;
}

export function IconeDeTipo({ tipo, tamanho = 22, cor = cores.texto }: Props) {
  return (
    <Ionicons
      name={ICONE_DO_TIPO[tipo]}
      size={tamanho}
      color={cor}
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}
