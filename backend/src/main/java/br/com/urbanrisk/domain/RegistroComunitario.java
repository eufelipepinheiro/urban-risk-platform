package br.com.urbanrisk.domain;

public record RegistroComunitario(
        TipoEvento tipo,
        Gravidade gravidade,
        double latitude,
        double longitude,
        String descricao) {
}
