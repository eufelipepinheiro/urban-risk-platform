package br.com.urbanrisk.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class TipoEventoTest {

    @ParameterizedTest
    @CsvSource({
            "ALAGAMENTO, 10, BAIXA",
            "ALAGAMENTO, 30, MODERADA",
            "ALAGAMENTO, 60, ALTA",
            "ALAGAMENTO, 100, CRITICA",
            "ILHA_DE_CALOR, 35.9, MODERADA",
            "ILHA_DE_CALOR, 40, CRITICA",
            "INTERRUPCAO_SERVICO, 4.9, BAIXA",
            "INTERRUPCAO_SERVICO, 20, ALTA"
    })
    void classificaLeituraPelosLimiares(TipoEvento tipo, double leitura, Gravidade esperada) {
        assertThat(tipo.gravidadePara(leitura)).isEqualTo(esperada);
    }
}
