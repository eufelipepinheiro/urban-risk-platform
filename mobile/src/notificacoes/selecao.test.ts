import { criarAlerta } from '../testes/fabricas';
import { montarNotificacao, selecionarNovosAlertasCriticos } from './selecao';

describe('selecionarNovosAlertasCriticos', () => {
  it('retorna apenas alertas de prioridade alta ainda não notificados', () => {
    const alertas = [
      criarAlerta({ prioridade: 'ALTA' }, { id: 1 }),
      criarAlerta({ prioridade: 'ALTA' }, { id: 2 }),
      criarAlerta({ prioridade: 'MEDIA' }, { id: 3 }),
    ];

    const novos = selecionarNovosAlertasCriticos(alertas, new Set([1]));

    expect(novos.map((alerta) => alerta.evento.id)).toEqual([2]);
  });
});

describe('montarNotificacao', () => {
  it('detalha o alerta quando há apenas um', () => {
    const conteudo = montarNotificacao([criarAlerta({ pontuacao: 84.6 }, { id: 7 })]);

    expect(conteudo.titulo).toBe('Alerta de prioridade alta: Alagamento');
    expect(conteudo.corpo).toBe('Leitura de 110,0 cm · Sensor SIM-ALAGAMENTO-01 · 85 pts');
    expect(conteudo.eventoId).toBe(7);
  });

  it('resume os tipos distintos quando há vários', () => {
    const conteudo = montarNotificacao([
      criarAlerta({}, { id: 1, tipo: 'ALAGAMENTO' }),
      criarAlerta({}, { id: 2, tipo: 'ALAGAMENTO' }),
      criarAlerta({}, { id: 3, tipo: 'ILHA_DE_CALOR' }),
    ]);

    expect(conteudo.titulo).toBe('3 novos alertas de prioridade alta');
    expect(conteudo.corpo).toBe('Alagamento, Ilha de calor');
    expect(conteudo.eventoId).toBeUndefined();
  });
});
