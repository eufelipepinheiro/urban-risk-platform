package br.com.urbanrisk.api;

import br.com.urbanrisk.api.dto.AlertaResponse;
import br.com.urbanrisk.domain.TipoEvento;
import br.com.urbanrisk.service.AlertaService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/alertas")
public class AlertaController {

    private final AlertaService servico;

    public AlertaController(AlertaService servico) {
        this.servico = servico;
    }

    @GetMapping
    public List<AlertaResponse> listarPriorizados(
            @RequestParam(required = false) TipoEvento tipo,
            @RequestParam(defaultValue = "20") int limite) {
        return servico.listarPriorizados(tipo, limite).stream().map(AlertaResponse::de).toList();
    }
}
