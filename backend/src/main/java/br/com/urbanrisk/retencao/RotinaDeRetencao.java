package br.com.urbanrisk.retencao;

import br.com.urbanrisk.service.EventoService;
import java.time.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class RotinaDeRetencao {

    private static final Logger REGISTRO = LoggerFactory.getLogger(RotinaDeRetencao.class);

    private final EventoService eventos;
    private final Duration retencao;

    public RotinaDeRetencao(EventoService eventos, @Value("${urbanrisk.retencao.dias:30}") long diasDeRetencao) {
        this.eventos = eventos;
        this.retencao = Duration.ofDays(diasDeRetencao);
    }

    @Scheduled(cron = "${urbanrisk.retencao.cron:0 0 3 * * *}")
    public void removerEventosExpirados() {
        int removidos = eventos.removerEventosAnterioresA(retencao);
        REGISTRO.info("Retenção de dados: {} eventos com mais de {} dias removidos", removidos, retencao.toDays());
    }
}
