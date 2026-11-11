package br.com.urbanrisk.analise;

import br.com.urbanrisk.domain.Evento;

public record PontuacaoDeAlerta(
        Evento evento,
        double pontos,
        NivelPrioridade prioridade,
        FatoresDePrioridade fatores) {
}
