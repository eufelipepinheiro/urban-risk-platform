import { ORIGENS_DE_DADO, TIPOS_DE_EVENTO } from '../api/tipos';
import type { OrigemDado, TipoEvento } from '../api/tipos';

export interface OpcaoDeFiltro<T extends string> {
  valor: T | undefined;
  rotulo: string;
}

const ROTULO_CURTO_DO_TIPO: Record<TipoEvento, string> = {
  ALAGAMENTO: 'Alagamentos',
  ILHA_DE_CALOR: 'Calor',
  INTERRUPCAO_SERVICO: 'Serviços',
};

const ROTULO_CURTO_DA_ORIGEM: Record<OrigemDado, string> = {
  SENSOR: 'Sensores',
  BASE_PUBLICA: 'Bases públicas',
  REGISTRO_COMUNITARIO: 'Comunitário',
};

export const OPCOES_DE_TIPO: OpcaoDeFiltro<TipoEvento>[] = [
  { valor: undefined, rotulo: 'Todos' },
  ...TIPOS_DE_EVENTO.map((valor) => ({ valor, rotulo: ROTULO_CURTO_DO_TIPO[valor] })),
];

export const OPCOES_DE_ORIGEM: OpcaoDeFiltro<OrigemDado>[] = [
  { valor: undefined, rotulo: 'Todas' },
  ...ORIGENS_DE_DADO.map((valor) => ({ valor, rotulo: ROTULO_CURTO_DA_ORIGEM[valor] })),
];
