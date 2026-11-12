import { buscarJson } from './cliente';
import type { Alerta, Evento } from './tipos';

const LIMITE_DE_ALERTAS = 100;
const LIMITE_DE_EVENTOS = 100;

export function listarAlertas(sinal?: AbortSignal): Promise<Alerta[]> {
  return buscarJson<Alerta[]>('/api/alertas', { limite: LIMITE_DE_ALERTAS }, sinal);
}

export function listarEventos(sinal?: AbortSignal): Promise<Evento[]> {
  return buscarJson<Evento[]>('/api/eventos', { limite: LIMITE_DE_EVENTOS }, sinal);
}
