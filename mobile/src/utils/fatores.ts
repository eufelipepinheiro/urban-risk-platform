import type { FatoresDePrioridade } from '../api/tipos';

export interface DescricaoDoFator {
  chave: keyof FatoresDePrioridade;
  rotulo: string;
  explicacao: string;
  pesoPercentual: number;
}

export const FATORES_DE_PRIORIDADE: DescricaoDoFator[] = [
  { chave: 'gravidade', rotulo: 'Gravidade', explicacao: 'Quão severa é a ocorrência.', pesoPercentual: 45 },
  {
    chave: 'confianca',
    rotulo: 'Confiança da fonte',
    explicacao: 'Sensores pesam mais que registros comunitários.',
    pesoPercentual: 20,
  },
  { chave: 'recencia', rotulo: 'Recência', explicacao: 'A relevância cai com o passar do tempo.', pesoPercentual: 20 },
  {
    chave: 'corroboracao',
    rotulo: 'Corroboração',
    explicacao: 'Outros eventos do mesmo tipo a até 1 km e 2 h.',
    pesoPercentual: 15,
  },
];

export function calcularContribuicaoEmPontos(fator: DescricaoDoFator, fatores: FatoresDePrioridade): number {
  return Math.round(fator.pesoPercentual * fatores[fator.chave]);
}
