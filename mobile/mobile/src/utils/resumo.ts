import { NIVEIS_DE_PRIORIDADE } from '../api/tipos';
import type { Alerta, NivelPrioridade, TipoEvento } from '../api/tipos';

const QUANTIDADE_DE_MAIS_URGENTES = 3;

export interface ResumoPorTipo {
  total: number;
  maiorPrioridade: NivelPrioridade | null;
}

export interface ResumoDoPainel {
  porPrioridade: Record<NivelPrioridade, number>;
  porTipo: Record<TipoEvento, ResumoPorTipo>;
  maisUrgentes: Alerta[];
}

const posicaoDaPrioridade = (prioridade: NivelPrioridade) => NIVEIS_DE_PRIORIDADE.indexOf(prioridade);

export function resumirAlertas(alertas: Alerta[]): ResumoDoPainel {
  const porPrioridade: Record<NivelPrioridade, number> = { BAIXA: 0, MEDIA: 0, ALTA: 0 };
  const porTipo: Record<TipoEvento, ResumoPorTipo> = {
    ALAGAMENTO: { total: 0, maiorPrioridade: null },
    ILHA_DE_CALOR: { total: 0, maiorPrioridade: null },
    INTERRUPCAO_SERVICO: { total: 0, maiorPrioridade: null },
  };

  for (const alerta of alertas) {
    porPrioridade[alerta.prioridade] += 1;

    const resumoDoTipo = porTipo[alerta.evento.tipo];
    resumoDoTipo.total += 1;
    const superaMaiorAtual =
      resumoDoTipo.maiorPrioridade === null ||
      posicaoDaPrioridade(alerta.prioridade) > posicaoDaPrioridade(resumoDoTipo.maiorPrioridade);
    if (superaMaiorAtual) {
      resumoDoTipo.maiorPrioridade = alerta.prioridade;
    }
  }

  const maisUrgentes = [...alertas]
    .sort((a, b) => b.pontuacao - a.pontuacao)
    .slice(0, QUANTIDADE_DE_MAIS_URGENTES);

  return { porPrioridade, porTipo, maisUrgentes };
}
