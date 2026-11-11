package br.com.urbanrisk.domain;

import java.time.Instant;

public record OcorrenciaPublica(
        TipoEvento tipo,
        String nomeFonte,
        Gravidade gravidade,
        double latitude,
        double longitude,
        String descricao,
        Instant ocorridoEm) {
}
