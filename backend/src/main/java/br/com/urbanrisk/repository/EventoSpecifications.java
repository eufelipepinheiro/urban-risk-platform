package br.com.urbanrisk.repository;

import br.com.urbanrisk.domain.Evento;
import br.com.urbanrisk.domain.OrigemDado;
import br.com.urbanrisk.domain.TipoEvento;
import java.time.Instant;
import org.springframework.data.jpa.domain.Specification;

public final class EventoSpecifications {

    private EventoSpecifications() {
    }

    public static Specification<Evento> comTipo(TipoEvento tipo) {
        return (evento, consulta, construtor) ->
                tipo == null ? null : construtor.equal(evento.get("tipo"), tipo);
    }

    public static Specification<Evento> comOrigem(OrigemDado origem) {
        return (evento, consulta, construtor) ->
                origem == null ? null : construtor.equal(evento.get("origem"), origem);
    }

    public static Specification<Evento> ocorridoDesde(Instant inicio) {
        return (evento, consulta, construtor) ->
                construtor.greaterThanOrEqualTo(evento.<Instant>get("ocorridoEm"), inicio);
    }
}
