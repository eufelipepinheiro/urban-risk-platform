import { useEffect, useRef } from 'react';
import { useAlertas } from '../hooks/useAlertas';
import { abrirDetalheDoAlerta } from '../navegacao/referencia';
import { selecionarNovosAlertasCriticos } from './selecao';
import { notificarNovosAlertas, ouvirToquesEmNotificacoes, prepararNotificacoes } from './servico';

const INTERVALO_MINIMO_ENTRE_NOTIFICACOES_MS = 30_000;

export function useNotificacoesDeAlerta() {
  const consulta = useAlertas();
  // null indica que a primeira carga ainda não ocorreu: os alertas já existentes não geram notificação.
  const jaNotificados = useRef<Set<number> | null>(null);
  const ultimaNotificacaoEm = useRef(0);

  useEffect(() => {
    void prepararNotificacoes();
    return ouvirToquesEmNotificacoes(abrirDetalheDoAlerta);
  }, []);

  useEffect(() => {
    if (!consulta.data) {
      return;
    }
    const criticos = consulta.data.filter((alerta) => alerta.prioridade === 'ALTA');

    if (jaNotificados.current === null) {
      jaNotificados.current = new Set(criticos.map((alerta) => alerta.evento.id));
      return;
    }

    const novos = selecionarNovosAlertasCriticos(criticos, jaNotificados.current);
    const agora = Date.now();
    const dentroDoIntervaloMinimo = agora - ultimaNotificacaoEm.current < INTERVALO_MINIMO_ENTRE_NOTIFICACOES_MS;
    // Alertas retidos continuam pendentes e saem agrupados na próxima notificação, evitando fadiga de alertas.
    if (novos.length === 0 || dentroDoIntervaloMinimo) {
      return;
    }

    ultimaNotificacaoEm.current = agora;
    novos.forEach((alerta) => jaNotificados.current?.add(alerta.evento.id));
    void notificarNovosAlertas(novos);
  }, [consulta.data]);
}
