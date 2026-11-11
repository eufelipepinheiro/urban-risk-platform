package br.com.urbanrisk.api.dto;

import br.com.urbanrisk.domain.OcorrenciaPublica;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record LoteBasePublicaRequest(
        @NotEmpty(message = "informe ao menos uma ocorrência")
        @Size(max = 500, message = "máximo de 500 ocorrências por lote")
        List<@NotNull(message = "ocorrência vazia") @Valid OcorrenciaPublicaRequest> registros) {

    public List<OcorrenciaPublica> paraOcorrencias() {
        return registros.stream().map(OcorrenciaPublicaRequest::paraOcorrencia).toList();
    }
}
