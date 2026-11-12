import { analisarInstante, descreverTempoDecorrido, formatarHorario } from './tempo';

const INSTANTE = '2026-11-09T12:00:00.000Z';
const base = Date.parse(INSTANTE);

describe('analisarInstante', () => {
  it('descarta dígitos de fração além dos milissegundos', () => {
    expect(analisarInstante('2026-11-09T12:00:00.123456789Z')).toBe(Date.parse('2026-11-09T12:00:00.123Z'));
  });

  it('aceita instantes sem fração de segundo', () => {
    expect(analisarInstante('2026-11-09T12:00:00Z')).toBe(base);
  });
});

describe('descreverTempoDecorrido', () => {
  it.each([
    [3_000, 'agora'],
    [30_000, 'há 30 s'],
    [5 * 60_000, 'há 5 min'],
    [3 * 3_600_000, 'há 3 h'],
    [2 * 86_400_000, 'há 2 d'],
  ])('descreve %i ms como "%s"', (decorrido, esperado) => {
    expect(descreverTempoDecorrido(INSTANTE, base + decorrido)).toBe(esperado);
  });

  it('trata instantes no futuro como "agora"', () => {
    expect(descreverTempoDecorrido(INSTANTE, base - 60_000)).toBe('agora');
  });
});

describe('formatarHorario', () => {
  it('formata hora, minuto e segundo com dois dígitos', () => {
    expect(formatarHorario(new Date(2026, 10, 9, 8, 5, 7).getTime())).toBe('08:05:07');
  });
});
