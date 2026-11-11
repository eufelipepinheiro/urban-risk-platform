package br.com.urbanrisk.api.dto;

import br.com.urbanrisk.api.validacao.Latitude;
import br.com.urbanrisk.api.validacao.Longitude;
import br.com.urbanrisk.domain.Gravidade;
import br.com.urbanrisk.domain.RegistroComunitario;
import br.com.urbanrisk.domain.TipoEvento;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegistroComunitarioRequest(
        @NotNull(message = "obrigatório") TipoEvento tipo,
        @NotNull(message = "obrigatório") Gravidade gravidade,
        @Latitude Double latitude,
        @Longitude Double longitude,
        @Size(max = 500, message = "máximo de 500 caracteres") String descricao) {

    public RegistroComunitario paraRegistro() {
        return new RegistroComunitario(tipo, gravidade, latitude, longitude, descricao);
    }
}
