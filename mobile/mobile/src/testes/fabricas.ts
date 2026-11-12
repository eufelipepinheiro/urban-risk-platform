import type { Alerta, Evento } from '../api/tipos';

export function criarEvento(parcial: Partial<Evento> = {}): Evento {
  return {
    id: 1,
    tipo: 'ALAGAMENTO',
    origem: 'SENSOR',
    nomeFonte: 'SIM-ALAGAMENTO-01',
    confianca: 'ALTA',
    gravidade: 'CRITICA',
    latitude: -23.6489,
    longitude: -46.8522,
    descricao: 'Leitura de 110,0 cm',
    ocorridoEm: '2026-11-09T12:00:00.123456Z',
    registradoEm: '2026-11-09T12:00:00.200000Z',
    ...parcial,
  };
}

export function criarAlerta(parcial: Partial<Alerta> = {}, evento: Partial<Evento> = {}): Alerta {
  return {
    evento: criarEvento(evento),
    pontuacao: 85,
    prioridade: 'ALTA',
    fatores: { gravidade: 1, confianca: 1, recencia: 1, corroboracao: 0 },
    ...parcial,
  };
}
