package br.com.urbanrisk.analise;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;

import br.com.urbanrisk.domain.Evento;
import br.com.urbanrisk.domain.Gravidade;
import br.com.urbanrisk.domain.NovoEvento;
import br.com.urbanrisk.domain.OrigemDado;
import br.com.urbanrisk.domain.TipoEvento;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import org.junit.jupiter.api.Test;

class PontuadorDePrioridadeTest {

    private static final Instant AGORA = Instant.parse("2026-11-09T12:00:00Z");
    private static final double LATITUDE = -23.65;
    private static final double LONGITUDE = -46.85;

    private final PontuadorDePrioridade pontuador = new PontuadorDePrioridade(Clock.fixed(AGORA, ZoneOffset.UTC));

    @Test
    void sensorCriticoRecenteTemPrioridadeAlta() {
        Evento evento = evento(TipoEvento.ALAGAMENTO, OrigemDado.SENSOR, Gravidade.CRITICA, LATITUDE, LONGITUDE, AGORA);

        PontuacaoDeAlerta alerta = pontuador.pontuar(evento, List.of(evento));

        assertThat(alerta.pontos()).isEqualTo(85.0);
        assertThat(alerta.prioridade()).isEqualTo(NivelPrioridade.ALTA);
    }

    @Test
    void registroComunitarioLeveEAntigoTemPrioridadeBaixa() {
        Instant haDuasMeiasVidas = AGORA.minus(TipoEvento.ALAGAMENTO.meiaVida().multipliedBy(2));
        Evento evento = evento(TipoEvento.ALAGAMENTO, OrigemDado.REGISTRO_COMUNITARIO, Gravidade.BAIXA, LATITUDE, LONGITUDE, haDuasMeiasVidas);

        PontuacaoDeAlerta alerta = pontuador.pontuar(evento, List.of(evento));

        assertThat(alerta.fatores().recencia()).isEqualTo(0.25);
        assertThat(alerta.pontos()).isCloseTo(24.25, within(0.1));
        assertThat(alerta.prioridade()).isEqualTo(NivelPrioridade.BAIXA);
    }

    @Test
    void recenciaCaiPelaMetadeAposUmaMeiaVida() {
        Instant haUmaMeiaVida = AGORA.minus(TipoEvento.ILHA_DE_CALOR.meiaVida());
        Evento evento = evento(TipoEvento.ILHA_DE_CALOR, OrigemDado.SENSOR, Gravidade.ALTA, LATITUDE, LONGITUDE, haUmaMeiaVida);

        assertThat(pontuador.pontuar(evento, List.of(evento)).fatores().recencia()).isEqualTo(0.5);
    }

    @Test
    void tresSensoresProximosCorroboramPorCompleto() {
        Evento alvo = evento(TipoEvento.ALAGAMENTO, OrigemDado.SENSOR, Gravidade.ALTA, LATITUDE, LONGITUDE, AGORA);
        List<Evento> recentes = List.of(
                alvo,
                evento(TipoEvento.ALAGAMENTO, OrigemDado.SENSOR, Gravidade.ALTA, LATITUDE, LONGITUDE, AGORA),
                evento(TipoEvento.ALAGAMENTO, OrigemDado.SENSOR, Gravidade.MODERADA, LATITUDE, LONGITUDE, AGORA),
                evento(TipoEvento.ALAGAMENTO, OrigemDado.SENSOR, Gravidade.ALTA, LATITUDE, LONGITUDE, AGORA));

        assertThat(pontuador.pontuar(alvo, recentes).fatores().corroboracao()).isEqualTo(1.0);
    }

    @Test
    void ignoraEventosDistantesOuDeOutroTipoNaCorroboracao() {
        Evento alvo = evento(TipoEvento.ALAGAMENTO, OrigemDado.SENSOR, Gravidade.ALTA, LATITUDE, LONGITUDE, AGORA);
        List<Evento> recentes = List.of(
                alvo,
                evento(TipoEvento.ALAGAMENTO, OrigemDado.SENSOR, Gravidade.ALTA, LATITUDE, LONGITUDE, AGORA),
                evento(TipoEvento.ALAGAMENTO, OrigemDado.SENSOR, Gravidade.ALTA, LATITUDE + 0.05, LONGITUDE, AGORA),
                evento(TipoEvento.ILHA_DE_CALOR, OrigemDado.SENSOR, Gravidade.ALTA, LATITUDE, LONGITUDE, AGORA));

        assertThat(pontuador.pontuar(alvo, recentes).fatores().corroboracao()).isEqualTo(0.33);
    }

    private Evento evento(TipoEvento tipo, OrigemDado origem, Gravidade gravidade,
                          double latitude, double longitude, Instant ocorridoEm) {
        return new Evento(new NovoEvento(tipo, origem, "fonte", gravidade, latitude, longitude, null, ocorridoEm), AGORA);
    }
}
