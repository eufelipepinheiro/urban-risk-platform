export const TIPOS_DE_EVENTO = ['ALAGAMENTO', 'ILHA_DE_CALOR', 'INTERRUPCAO_SERVICO'] as const;
export const ORIGENS_DE_DADO = ['SENSOR', 'BASE_PUBLICA', 'REGISTRO_COMUNITARIO'] as const;
export const NIVEIS_DE_PRIORIDADE = ['BAIXA', 'MEDIA', 'ALTA'] as const;

export type TipoEvento = (typeof TIPOS_DE_EVENTO)[number];
export type OrigemDado = (typeof ORIGENS_DE_DADO)[number];
export type NivelPrioridade = (typeof NIVEIS_DE_PRIORIDADE)[number];
export type Gravidade = 'BAIXA' | 'MODERADA' | 'ALTA' | 'CRITICA';
export type NivelConfianca = 'BAIXA' | 'MEDIA' | 'ALTA';

export interface Evento {
  id: number;
  tipo: TipoEvento;
  origem: OrigemDado;
  nomeFonte: string;
  confianca: NivelConfianca;
  gravidade: Gravidade;
  latitude: number;
  longitude: number;
  descricao: string | null;
  ocorridoEm: string;
  registradoEm: string;
}

export interface FatoresDePrioridade {
  gravidade: number;
  confianca: number;
  recencia: number;
  corroboracao: number;
}

export interface Alerta {
  evento: Evento;
  pontuacao: number;
  prioridade: NivelPrioridade;
  fatores: FatoresDePrioridade;
}
