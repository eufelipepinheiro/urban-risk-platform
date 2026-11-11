package br.com.urbanrisk.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class AnonimizadorDeTextoTest {

    @Test
    void removeTelefoneEEmail() {
        String texto = "Falar com o morador no (11) 98765-4321 ou joao.silva@email.com";

        assertThat(AnonimizadorDeTexto.anonimizar(texto))
                .isEqualTo("Falar com o morador no [telefone removido] ou [e-mail removido]");
    }

    @Test
    void removeCpfSemDeixarFragmentosDeTelefone() {
        assertThat(AnonimizadorDeTexto.anonimizar("CPF 123.456.789-09 do responsável"))
                .isEqualTo("CPF [documento removido] do responsável");
    }

    @Test
    void preservaTextoSemDadosPessoais() {
        String texto = "Água acima de 40 cm na rua principal";

        assertThat(AnonimizadorDeTexto.anonimizar(texto)).isEqualTo(texto);
    }

    @Test
    void aceitaTextoNulo() {
        assertThat(AnonimizadorDeTexto.anonimizar(null)).isNull();
    }
}
