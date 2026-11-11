package br.com.urbanrisk.domain;

import java.time.Instant;

public record NovoEvento(
        TipoEvento tipo,
        OrigemDado origem,
        String nomeFonte,
        Gravidade gravidade,
        double latitude,
        double longitude,
        String descricao,
        Instant ocorridoEm) {

    public Instant ocorridoEmOu(Instant padrao) {
        return ocorridoEm != null ? ocorridoEm : padrao;
    }
}
