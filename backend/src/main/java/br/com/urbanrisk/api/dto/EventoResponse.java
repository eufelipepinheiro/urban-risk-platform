package br.com.urbanrisk.api.dto;

import br.com.urbanrisk.domain.Evento;
import br.com.urbanrisk.domain.Gravidade;
import br.com.urbanrisk.domain.NivelConfianca;
import br.com.urbanrisk.domain.OrigemDado;
import br.com.urbanrisk.domain.TipoEvento;
import java.time.Instant;

public record EventoResponse(
        Long id,
        TipoEvento tipo,
        OrigemDado origem,
        String nomeFonte,
        NivelConfianca confianca,
        Gravidade gravidade,
        double latitude,
        double longitude,
        String descricao,
        Instant ocorridoEm,
        Instant registradoEm) {

    public static EventoResponse de(Evento evento) {
        return new EventoResponse(
                evento.getId(),
                evento.getTipo(),
                evento.getOrigem(),
                evento.getNomeFonte(),
                evento.getConfianca(),
                evento.getGravidade(),
                evento.getLatitude(),
                evento.getLongitude(),
                evento.getDescricao(),
                evento.getOcorridoEm(),
                evento.getRegistradoEm());
    }
}
