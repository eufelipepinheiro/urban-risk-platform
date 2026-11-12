import { calcularContribuicaoEmPontos, FATORES_DE_PRIORIDADE } from './fatores';

describe('FATORES_DE_PRIORIDADE', () => {
  it('somam 100% de peso', () => {
    const soma = FATORES_DE_PRIORIDADE.reduce((total, fator) => total + fator.pesoPercentual, 0);

    expect(soma).toBe(100);
  });

  it('calculam a contribuição em pontos de cada fator', () => {
    const fatores = { gravidade: 1, confianca: 0.4, recencia: 0.5, corroboracao: 0 };
    const contribuicoes = FATORES_DE_PRIORIDADE.map((fator) => calcularContribuicaoEmPontos(fator, fatores));

    expect(contribuicoes).toEqual([45, 8, 10, 0]);
  });
});
