import type { NivelPrioridade } from '../api/tipos';

export const cores = {
  fundo: '#F4F6F8',
  superficie: '#FFFFFF',
  texto: '#1A1C1E',
  textoSecundario: '#4A5560',
  borda: '#D5DBE1',
  primaria: '#0B4F8A',
  sobrePrimaria: '#FFFFFF',
  erro: '#8C1D18',
};

export const coresDePrioridade: Record<NivelPrioridade, { texto: string; fundo: string }> = {
  ALTA: { texto: '#8C1D18', fundo: '#FDE7E5' },
  MEDIA: { texto: '#6B4A00', fundo: '#FFF1CC' },
  BAIXA: { texto: '#1B5E20', fundo: '#E3F4E4' },
};

export const espacamento = { pequeno: 8, medio: 16, grande: 24 };

export const ALTURA_MINIMA_DE_TOQUE = 48;
