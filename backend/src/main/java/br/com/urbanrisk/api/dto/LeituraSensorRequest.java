package br.com.urbanrisk.api.dto;

import br.com.urbanrisk.api.validacao.Latitude;
import br.com.urbanrisk.api.validacao.Longitude;
import br.com.urbanrisk.domain.LeituraDeSensor;
import br.com.urbanrisk.domain.TipoEvento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record LeituraSensorRequest(
        @NotBlank(message = "obrigatório") @Size(max = 100, message = "máximo de 100 caracteres") String sensorId,
        @NotNull(message = "obrigatório") TipoEvento tipo,
        @NotNull(message = "obrigatório") Double valor,
        @Latitude Double latitude,
        @Longitude Double longitude,
        Instant medidoEm) {

    public LeituraDeSensor paraLeitura() {
        return new LeituraDeSensor(sensorId, tipo, valor, latitude, longitude, medidoEm);
    }
}
