package br.com.urbanrisk.api;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.urbanrisk.domain.Evento;
import br.com.urbanrisk.domain.Gravidade;
import br.com.urbanrisk.domain.LeituraDeSensor;
import br.com.urbanrisk.domain.RegistroComunitario;
import br.com.urbanrisk.domain.TipoEvento;
import br.com.urbanrisk.service.IngestaoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

@TesteDeIntegracao
class EventoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private IngestaoService ingestao;

    @Test
    void buscaEventoPorIdInformandoOrigemEConfianca() throws Exception {
        Evento evento = ingestao.registrarLeituraDeSensor(
                new LeituraDeSensor("SENSOR-12", TipoEvento.ALAGAMENTO, 85, -23.65, -46.85, null));

        mockMvc.perform(get("/api/eventos/{id}", evento.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.origem").value("SENSOR"))
                .andExpect(jsonPath("$.confianca").value("ALTA"))
                .andExpect(jsonPath("$.gravidade").value("ALTA"));
    }

    @Test
    void retorna404ParaEventoInexistente() throws Exception {
        mockMvc.perform(get("/api/eventos/999999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void filtraListagemPorTipo() throws Exception {
        ingestao.registrarLeituraDeSensor(
                new LeituraDeSensor("SENSOR-12", TipoEvento.ALAGAMENTO, 85, -23.65, -46.85, null));
        ingestao.registrarRegistroComunitario(
                new RegistroComunitario(TipoEvento.ILHA_DE_CALOR, Gravidade.MODERADA, -23.66, -46.86, "Calor intenso"));

        mockMvc.perform(get("/api/eventos").param("tipo", "ILHA_DE_CALOR"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].confianca").value("BAIXA"));
    }
}
