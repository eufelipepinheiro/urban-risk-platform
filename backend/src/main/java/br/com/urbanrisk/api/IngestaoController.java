package br.com.urbanrisk.api;

import br.com.urbanrisk.api.dto.EventoResponse;
import br.com.urbanrisk.api.dto.LeituraSensorRequest;
import br.com.urbanrisk.api.dto.LoteBasePublicaRequest;
import br.com.urbanrisk.api.dto.RegistroComunitarioRequest;
import br.com.urbanrisk.api.dto.ResultadoIngestaoResponse;
import br.com.urbanrisk.service.IngestaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

// A origem do dado é definida pela rota, nunca pelo corpo da requisição.
@RestController
@RequestMapping("/api/ingestao")
public class IngestaoController {

    private final IngestaoService servico;

    public IngestaoController(IngestaoService servico) {
        this.servico = servico;
    }

    @PostMapping("/sensores")
    @ResponseStatus(HttpStatus.CREATED)
    public EventoResponse registrarLeituraDeSensor(@Valid @RequestBody LeituraSensorRequest requisicao) {
        return EventoResponse.de(servico.registrarLeituraDeSensor(requisicao.paraLeitura()));
    }

    @PostMapping("/bases-publicas")
    @ResponseStatus(HttpStatus.CREATED)
    public ResultadoIngestaoResponse registrarOcorrenciasPublicas(@Valid @RequestBody LoteBasePublicaRequest requisicao) {
        int registrados = servico.registrarOcorrenciasPublicas(requisicao.paraOcorrencias()).size();
        return new ResultadoIngestaoResponse(registrados);
    }

    @PostMapping("/comunitario")
    @ResponseStatus(HttpStatus.CREATED)
    public EventoResponse registrarRegistroComunitario(@Valid @RequestBody RegistroComunitarioRequest requisicao) {
        return EventoResponse.de(servico.registrarRegistroComunitario(requisicao.paraRegistro()));
    }
}
