package br.com.urbanrisk.retencao;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import br.com.urbanrisk.api.TesteDeIntegracao;
import br.com.urbanrisk.domain.Gravidade;
import br.com.urbanrisk.domain.OcorrenciaPublica;
import br.com.urbanrisk.domain.TipoEvento;
import br.com.urbanrisk.service.EventoService;
import br.com.urbanrisk.service.IngestaoService;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

@TesteDeIntegracao
class RetencaoDeEventosTest {

    @Autowired
    private IngestaoService ingestao;

    @Autowired
    private EventoService eventos;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void removeSomenteEventosMaisAntigosQueOPeriodoDeRetencao() throws Exception {
        ingestao.registrarOcorrenciasPublicas(List.of(
                ocorrencia("Antiga", Instant.now().minus(Duration.ofDays(40))),
                ocorrencia("Recente", Instant.now().minus(Duration.ofDays(1)))));

        int removidos = eventos.removerEventosAnterioresA(Duration.ofDays(30));

        assertThat(removidos).isEqualTo(1);
        mockMvc.perform(get("/api/eventos"))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].nomeFonte").value("Recente"));
    }

    private OcorrenciaPublica ocorrencia(String fonte, Instant ocorridoEm) {
        return new OcorrenciaPublica(TipoEvento.ALAGAMENTO, fonte, Gravidade.ALTA, -23.65, -46.85, null, ocorridoEm);
    }
}
