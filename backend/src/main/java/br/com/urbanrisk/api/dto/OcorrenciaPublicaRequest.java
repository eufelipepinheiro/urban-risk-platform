package br.com.urbanrisk.api.dto;

import br.com.urbanrisk.api.validacao.Latitude;
import br.com.urbanrisk.api.validacao.Longitude;
import br.com.urbanrisk.domain.Gravidade;
import br.com.urbanrisk.domain.OcorrenciaPublica;
import br.com.urbanrisk.domain.TipoEvento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record OcorrenciaPublicaRequest(
        @NotNull(message = "obrigatório") TipoEvento tipo,
        @NotBlank(message = "obrigatório") @Size(max = 100, message = "máximo de 100 caracteres") String nomeFonte,
        @NotNull(message = "obrigatório") Gravidade gravidade,
        @Latitude Double latitude,
        @Longitude Double longitude,
        @Size(max = 500, message = "máximo de 500 caracteres") String descricao,
        Instant ocorridoEm) {

    public OcorrenciaPublica paraOcorrencia() {
        return new OcorrenciaPublica(tipo, nomeFonte, gravidade, latitude, longitude, descricao, ocorridoEm);
    }
}
