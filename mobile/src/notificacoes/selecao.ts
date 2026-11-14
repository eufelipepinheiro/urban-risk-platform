import type { Alerta } from '../api/tipos';
import { ROTULO_ORIGEM, ROTULO_TIPO } from '../utils/rotulos';

export interface ConteudoDeNotificacao {
  titulo: string;
  corpo: string;
  eventoId?: number;
}

export function selecionarNovosAlertasCriticos(alertas: Alerta[], jaNotificados: ReadonlySet<number>): Alerta[] {
  return alertas.filter((alerta) => alerta.prioridade === 'ALTA' && !jaNotificados.has(alerta.evento.id));
}

export function montarNotificacao(novos: Alerta[]): ConteudoDeNotificacao {
  if (novos.length === 1) {
    const { evento, pontuacao } = novos[0];
    return {
      titulo: `Alerta de prioridade alta: ${ROTULO_TIPO[evento.tipo]}`,
      corpo: `${evento.descricao ?? 'Sem descrição'} · ${ROTULO_ORIGEM[evento.origem]} ${evento.nomeFonte} · ${Math.round(pontuacao)} pts`,
      eventoId: evento.id,
    };
  }

  const tipos = Array.from(new Set(novos.map((alerta) => ROTULO_TIPO[alerta.evento.tipo])));
  return { titulo: `${novos.length} novos alertas de prioridade alta`, corpo: tipos.join(', ') };
}
