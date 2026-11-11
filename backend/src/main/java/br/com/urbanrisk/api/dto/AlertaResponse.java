package br.com.urbanrisk.api.dto;

import br.com.urbanrisk.analise.FatoresDePrioridade;
import br.com.urbanrisk.analise.NivelPrioridade;
import br.com.urbanrisk.analise.PontuacaoDeAlerta;

public record AlertaResponse(
        EventoResponse evento,
        double pontuacao,
        NivelPrioridade prioridade,
        FatoresDePrioridade fatores) {

    public static AlertaResponse de(PontuacaoDeAlerta alerta) {
        return new AlertaResponse(
                EventoResponse.de(alerta.evento()),
                alerta.pontos(),
                alerta.prioridade(),
                alerta.fatores());
    }
}
