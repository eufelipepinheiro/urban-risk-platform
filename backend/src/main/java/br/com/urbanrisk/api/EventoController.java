package br.com.urbanrisk.api;

import br.com.urbanrisk.api.dto.EventoResponse;
import br.com.urbanrisk.domain.OrigemDado;
import br.com.urbanrisk.domain.TipoEvento;
import br.com.urbanrisk.service.EventoService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    private final EventoService servico;

    public EventoController(EventoService servico) {
        this.servico = servico;
    }

    @GetMapping
    public List<EventoResponse> listar(
            @RequestParam(required = false) TipoEvento tipo,
            @RequestParam(required = false) OrigemDado origem,
            @RequestParam(defaultValue = "50") int limite) {
        return servico.listar(tipo, origem, limite).stream().map(EventoResponse::de).toList();
    }

    @GetMapping("/{id}")
    public EventoResponse buscarPorId(@PathVariable Long id) {
        return EventoResponse.de(servico.buscarPorId(id));
    }
}
