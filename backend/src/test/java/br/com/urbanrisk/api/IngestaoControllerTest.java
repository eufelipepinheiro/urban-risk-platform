package br.com.urbanrisk.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

@TesteDeIntegracao
class IngestaoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void classificaLeituraCriticaDeSensorEAtribuiConfiancaAlta() throws Exception {
        enviar("/api/ingestao/sensores", """
                {"sensorId": "SENSOR-12", "tipo": "ALAGAMENTO", "valor": 110, "latitude": -23.65, "longitude": -46.85}
                """)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.origem").value("SENSOR"))
                .andExpect(jsonPath("$.nomeFonte").value("SENSOR-12"))
                .andExpect(jsonPath("$.gravidade").value("CRITICA"))
                .andExpect(jsonPath("$.confianca").value("ALTA"));
    }

    @Test
    void rejeitaLeituraSemValor() throws Exception {
        enviar("/api/ingestao/sensores", """
                {"sensorId": "SENSOR-12", "tipo": "ALAGAMENTO", "latitude": -23.65, "longitude": -46.85}
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.valor").exists());
    }

    @Test
    void rejeitaLatitudeForaDoIntervalo() throws Exception {
        enviar("/api/ingestao/sensores", """
                {"sensorId": "SENSOR-12", "tipo": "ALAGAMENTO", "valor": 10, "latitude": 120, "longitude": -46.85}
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.latitude").exists());
    }

    @Test
    void anonimizaDadosPessoaisDoRegistroComunitario() throws Exception {
        enviar("/api/ingestao/comunitario", """
                {"tipo": "ALAGAMENTO", "gravidade": "ALTA", "latitude": -23.65, "longitude": -46.85,
                 "descricao": "Rua alagada, ligar (11) 98765-4321"}
                """)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.origem").value("REGISTRO_COMUNITARIO"))
                .andExpect(jsonPath("$.confianca").value("BAIXA"))
                .andExpect(jsonPath("$.descricao").value("Rua alagada, ligar [telefone removido]"));
    }

    @Test
    void registraLoteDeBasePublica() throws Exception {
        enviar("/api/ingestao/bases-publicas", """
                {"registros": [
                  {"tipo": "ALAGAMENTO", "nomeFonte": "Defesa Civil", "gravidade": "ALTA", "latitude": -23.65, "longitude": -46.85},
                  {"tipo": "INTERRUPCAO_SERVICO", "nomeFonte": "Concessionária", "gravidade": "MODERADA", "latitude": -23.64, "longitude": -46.84}
                ]}
                """)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.registrados").value(2));
    }

    @Test
    void rejeitaLoteVazio() throws Exception {
        enviar("/api/ingestao/bases-publicas", """
                {"registros": []}
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.registros").exists());
    }

    private ResultActions enviar(String rota, String corpo) throws Exception {
        return mockMvc.perform(post(rota).contentType(MediaType.APPLICATION_JSON).content(corpo));
    }
}
