package br.com.urbanrisk.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import br.com.urbanrisk.domain.Evento;
import br.com.urbanrisk.domain.Gravidade;
import br.com.urbanrisk.domain.NivelConfianca;
import br.com.urbanrisk.domain.NovoEvento;
import br.com.urbanrisk.domain.OrigemDado;
import br.com.urbanrisk.domain.TipoEvento;
import br.com.urbanrisk.repository.EventoRepository;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EventoServiceTest {

    private static final Instant AGORA = Instant.parse("2026-11-09T12:00:00Z");

    @Mock
    private EventoRepository repositorio;

    private EventoService servico;

    @BeforeEach
    void criarServico() {
        servico = new EventoService(repositorio, Clock.fixed(AGORA, ZoneOffset.UTC));
    }

    @ParameterizedTest
    @CsvSource({
            "SENSOR, ALTA",
            "BASE_PUBLICA, MEDIA",
            "REGISTRO_COMUNITARIO, BAIXA"
    })
    void derivaConfiancaDaOrigem(OrigemDado origem, NivelConfianca confiancaEsperada) {
        repositorioDevolveEntidadeSalva();

        Evento evento = servico.registrar(novoEvento(origem, null));

        assertThat(evento.getConfianca()).isEqualTo(confiancaEsperada);
    }

    @Test
    void usaHorarioAtualQuandoOcorrenciaNaoInformada() {
        repositorioDevolveEntidadeSalva();

        Evento evento = servico.registrar(novoEvento(OrigemDado.SENSOR, null));

        assertThat(evento.getOcorridoEm()).isEqualTo(AGORA);
        assertThat(evento.getRegistradoEm()).isEqualTo(AGORA);
    }

    @Test
    void preservaHorarioDeOcorrenciaInformado() {
        repositorioDevolveEntidadeSalva();
        Instant ontem = AGORA.minusSeconds(86_400);

        Evento evento = servico.registrar(novoEvento(OrigemDado.BASE_PUBLICA, ontem));

        assertThat(evento.getOcorridoEm()).isEqualTo(ontem);
        assertThat(evento.getRegistradoEm()).isEqualTo(AGORA);
    }

    @Test
    void lancaExcecaoAoBuscarEventoInexistente() {
        when(repositorio.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> servico.buscarPorId(99L))
                .isInstanceOf(EventoNaoEncontradoException.class)
                .hasMessageContaining("99");
    }

    private void repositorioDevolveEntidadeSalva() {
        when(repositorio.save(any(Evento.class))).thenAnswer(chamada -> chamada.getArgument(0));
    }

    private NovoEvento novoEvento(OrigemDado origem, Instant ocorridoEm) {
        return new NovoEvento(
                TipoEvento.ALAGAMENTO, origem, "Fonte de teste", Gravidade.ALTA,
                -23.65, -46.85, "Descrição de teste", ocorridoEm);
    }
}
