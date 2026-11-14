package br.com.urbanrisk.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

@TesteDeIntegracao
class IngestaoControllerTest {

    private static final String ROTA_SENSORES = "/api/ingestao/sensores";
    private static final String ROTA_BASES_PUBLICAS = "/api/ingestao/bases-publicas";
    private static final String ROTA_COMUNITARIO = "/api/ingestao/comunitario";

    private static final Map<String, String> CHAVE_POR_ROTA = Map.of(
            ROTA_SENSORES, ChavesDeTeste.SENSORES,
            ROTA_BASES_PUBLICAS, ChavesDeTeste.BASES_PUBLICAS,
            ROTA_COMUNITARIO, ChavesDeTeste.COMUNITARIO);

    private static final String LEITURA_VALIDA = """
            {"sensorId": "SENSOR-12", "tipo": "ALAGAMENTO", "valor": 110, "latitude": -23.65, "longitude": -46.85}
            """;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void classificaLeituraCriticaDeSensorEAtribuiConfiancaAlta() throws Exception {
        enviar(ROTA_SENSORES, LEITURA_VALIDA)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.origem").value("SENSOR"))
                .andExpect(jsonPath("$.nomeFonte").value("SENSOR-12"))
                .andExpect(jsonPath("$.gravidade").value("CRITICA"))
                .andExpect(jsonPath("$.confianca").value("ALTA"));
    }

    @Test
    void rejeitaLeituraSemValor() throws Exception {
        enviar(ROTA_SENSORES, """
                {"sensorId": "SENSOR-12", "tipo": "ALAGAMENTO", "latitude": -23.65, "longitude": -46.85}
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.valor").exists());
    }

    @Test
    void rejeitaLatitudeForaDoIntervalo() throws Exception {
        enviar(ROTA_SENSORES, """
                {"sensorId": "SENSOR-12", "tipo": "ALAGAMENTO", "valor": 10, "latitude": 120, "longitude": -46.85}
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.latitude").exists());
    }

    @Test
    void anonimizaDadosPessoaisDoRegistroComunitario() throws Exception {
        enviar(ROTA_COMUNITARIO, """
                {"tipo": "ALAGAMENTO", "gravidade": "ALTA", "latitude": -23.65, "longitude": -46.85,
                 "descricao": "Rua alagada, ligar (11) 98765-4321"}
                """)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.origem").value("REGISTRO_COMUNITARIO"))
                .andExpect(jsonPath("$.confianca").value("BAIXA"))
                .andExpect(jsonPath("$.descricao").value("Rua alagada, ligar [telefone removido]"));
    }

    @Test
    void reduzPrecisaoDaLocalizacaoDoRegistroComunitario() throws Exception {
        enviar(ROTA_COMUNITARIO, """
                {"tipo": "ALAGAMENTO", "gravidade": "ALTA", "latitude": -23.65432, "longitude": -46.85678}
                """)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.latitude").value(-23.654))
                .andExpect(jsonPath("$.longitude").value(-46.857));
    }

    @Test
    void registraLoteDeBasePublica() throws Exception {
        enviar(ROTA_BASES_PUBLICAS, """
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
        enviar(ROTA_BASES_PUBLICAS, """
                {"registros": []}
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.registros").exists());
    }

    @Test
    void recusaIngestaoSemChave() throws Exception {
        enviarComChave(ROTA_SENSORES, LEITURA_VALIDA, null)
                .andExpect(status().isUnauthorized());
    }

    @Test
    void recusaChaveDeOutraOrigem() throws Exception {
        enviarComChave(ROTA_SENSORES, LEITURA_VALIDA, ChavesDeTeste.COMUNITARIO)
                .andExpect(status().isUnauthorized());
    }

    @Test
    void leituraDeAlertasNaoExigeChave() throws Exception {
        mockMvc.perform(get("/api/alertas")).andExpect(status().isOk());
    }

    private ResultActions enviar(String rota, String corpo) throws Exception {
        return enviarComChave(rota, corpo, CHAVE_POR_ROTA.get(rota));
    }

    private ResultActions enviarComChave(String rota, String corpo, String chave) throws Exception {
        MockHttpServletRequestBuilder requisicao = post(rota).contentType(MediaType.APPLICATION_JSON).content(corpo);
        if (chave != null) {
            requisicao.header("X-API-Key", chave);
        }
        return mockMvc.perform(requisicao);
    }
}
