package br.com.urbanrisk.api;

import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.urbanrisk.domain.Gravidade;
import br.com.urbanrisk.domain.LeituraDeSensor;
import br.com.urbanrisk.domain.RegistroComunitario;
import br.com.urbanrisk.domain.TipoEvento;
import br.com.urbanrisk.service.IngestaoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

@TesteDeIntegracao
class AlertaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private IngestaoService ingestao;

    @Test
    void priorizaSensorCriticoSobreRegistroComunitarioLeve() throws Exception {
        ingestao.registrarRegistroComunitario(
                new RegistroComunitario(TipoEvento.ALAGAMENTO, Gravidade.BAIXA, -23.70, -46.90, "Poça na calçada"));
        ingestao.registrarLeituraDeSensor(
                new LeituraDeSensor("SENSOR-12", TipoEvento.ALAGAMENTO, 110, -23.65, -46.85, null));

        mockMvc.perform(get("/api/alertas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].evento.origem").value("SENSOR"))
                .andExpect(jsonPath("$[0].prioridade").value("ALTA"))
                .andExpect(jsonPath("$[0].pontuacao", greaterThan(65.0)))
                .andExpect(jsonPath("$[1].prioridade").value("BAIXA"));
    }

    @Test
    void explicaOsFatoresDeCadaAlerta() throws Exception {
        ingestao.registrarLeituraDeSensor(
                new LeituraDeSensor("SENSOR-12", TipoEvento.ALAGAMENTO, 110, -23.65, -46.85, null));

        mockMvc.perform(get("/api/alertas"))
                .andExpect(jsonPath("$[0].fatores.gravidade").exists())
                .andExpect(jsonPath("$[0].fatores.confianca").exists())
                .andExpect(jsonPath("$[0].fatores.recencia").exists())
                .andExpect(jsonPath("$[0].fatores.corroboracao").exists());
    }

    @Test
    void filtraAlertasPorTipo() throws Exception {
        ingestao.registrarLeituraDeSensor(
                new LeituraDeSensor("SENSOR-12", TipoEvento.ALAGAMENTO, 110, -23.65, -46.85, null));
        ingestao.registrarLeituraDeSensor(
                new LeituraDeSensor("SENSOR-30", TipoEvento.ILHA_DE_CALOR, 41, -23.66, -46.86, null));

        mockMvc.perform(get("/api/alertas").param("tipo", "ILHA_DE_CALOR"))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].evento.tipo").value("ILHA_DE_CALOR"));
    }
}
