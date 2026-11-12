import type { Gravidade, NivelConfianca, NivelPrioridade, OrigemDado, TipoEvento } from '../api/tipos';

export const ROTULO_TIPO: Record<TipoEvento, string> = {
  ALAGAMENTO: 'Alagamento',
  ILHA_DE_CALOR: 'Ilha de calor',
  INTERRUPCAO_SERVICO: 'Interrupção de serviço',
};

export const ROTULO_ORIGEM: Record<OrigemDado, string> = {
  SENSOR: 'Sensor',
  BASE_PUBLICA: 'Base pública',
  REGISTRO_COMUNITARIO: 'Registro comunitário',
};

export const ROTULO_CONFIANCA: Record<NivelConfianca, string> = {
  BAIXA: 'baixa',
  MEDIA: 'média',
  ALTA: 'alta',
};

export const ROTULO_PRIORIDADE: Record<NivelPrioridade, string> = {
  BAIXA: 'Prioridade baixa',
  MEDIA: 'Prioridade média',
  ALTA: 'Prioridade alta',
};

export const ROTULO_GRAVIDADE: Record<Gravidade, string> = {
  BAIXA: 'baixa',
  MODERADA: 'moderada',
  ALTA: 'alta',
  CRITICA: 'crítica',
};
