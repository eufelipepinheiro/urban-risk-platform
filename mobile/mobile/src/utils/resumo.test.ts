import { criarAlerta } from '../testes/fabricas';
import { resumirAlertas } from './resumo';

describe('resumirAlertas', () => {
  it('retorna contagens zeradas quando não há alertas', () => {
    const resumo = resumirAlertas([]);

    expect(resumo.porPrioridade).toEqual({ BAIXA: 0, MEDIA: 0, ALTA: 0 });
    expect(resumo.porTipo.ALAGAMENTO).toEqual({ total: 0, maiorPrioridade: null });
    expect(resumo.maisUrgentes).toEqual([]);
  });

  it('conta alertas por prioridade e por tipo, guardando a maior prioridade de cada tipo', () => {
    const resumo = resumirAlertas([
      criarAlerta({ prioridade: 'BAIXA', pontuacao: 30 }, { id: 1, tipo: 'ALAGAMENTO' }),
      criarAlerta({ prioridade: 'ALTA', pontuacao: 80 }, { id: 2, tipo: 'ALAGAMENTO' }),
      criarAlerta({ prioridade: 'MEDIA', pontuacao: 50 }, { id: 3, tipo: 'ILHA_DE_CALOR' }),
    ]);

    expect(resumo.porPrioridade).toEqual({ BAIXA: 1, MEDIA: 1, ALTA: 1 });
    expect(resumo.porTipo.ALAGAMENTO).toEqual({ total: 2, maiorPrioridade: 'ALTA' });
    expect(resumo.porTipo.ILHA_DE_CALOR).toEqual({ total: 1, maiorPrioridade: 'MEDIA' });
    expect(resumo.porTipo.INTERRUPCAO_SERVICO.maiorPrioridade).toBeNull();
  });

  it('seleciona os três alertas de maior pontuação sem alterar a lista original', () => {
    const alertas = [10, 90, 40, 70, 20].map((pontuacao, indice) =>
      criarAlerta({ pontuacao }, { id: indice + 1 }),
    );

    const resumo = resumirAlertas(alertas);

    expect(resumo.maisUrgentes.map((alerta) => alerta.pontuacao)).toEqual([90, 70, 40]);
    expect(alertas.map((alerta) => alerta.pontuacao)).toEqual([10, 90, 40, 70, 20]);
  });
});
