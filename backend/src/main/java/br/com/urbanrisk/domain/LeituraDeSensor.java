package br.com.urbanrisk.domain;

import java.time.Instant;

public record LeituraDeSensor(
        String sensorId,
        TipoEvento tipo,
        double valor,
        double latitude,
        double longitude,
        Instant medidoEm) {
}
