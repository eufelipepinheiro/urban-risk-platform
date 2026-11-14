package br.com.urbanrisk.seguranca;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class FiltroDeChaveDeIngestaoTest {

    private final FiltroDeChaveDeIngestao filtro = new FiltroDeChaveDeIngestao("chave-sensores", "chave-bases", "");

    @Test
    void aceitaRequisicaoComAChaveDaPropriaRota() throws Exception {
        MockHttpServletRequest requisicao = requisicao("POST", "/api/ingestao/sensores");
        requisicao.addHeader("X-API-Key", "chave-sensores");

        MockFilterChain cadeia = executar(requisicao, new MockHttpServletResponse());

        assertThat(cadeia.getRequest()).isNotNull();
    }

    @Test
    void recusaRequisicaoSemChave() throws Exception {
        MockHttpServletResponse resposta = new MockHttpServletResponse();

        MockFilterChain cadeia = executar(requisicao("POST", "/api/ingestao/sensores"), resposta);

        assertThat(cadeia.getRequest()).isNull();
        assertThat(resposta.getStatus()).isEqualTo(401);
        assertThat(resposta.getContentAsString()).contains("Chave de API ausente ou inválida");
    }

    @Test
    void recusaChaveDeOutraOrigem() throws Exception {
        MockHttpServletRequest requisicao = requisicao("POST", "/api/ingestao/sensores");
        requisicao.addHeader("X-API-Key", "chave-bases");
        MockHttpServletResponse resposta = new MockHttpServletResponse();

        executar(requisicao, resposta);

        assertThat(resposta.getStatus()).isEqualTo(401);
    }

    @Test
    void recusaTudoQuandoAChaveDaRotaNaoFoiConfigurada() throws Exception {
        MockHttpServletRequest requisicao = requisicao("POST", "/api/ingestao/comunitario");
        requisicao.addHeader("X-API-Key", "");
        MockHttpServletResponse resposta = new MockHttpServletResponse();

        executar(requisicao, resposta);

        assertThat(resposta.getStatus()).isEqualTo(401);
    }

    @Test
    void naoExigeChaveForaDaIngestao() throws Exception {
        MockFilterChain cadeia = executar(requisicao("GET", "/api/alertas"), new MockHttpServletResponse());

        assertThat(cadeia.getRequest()).isNotNull();
    }

    private MockHttpServletRequest requisicao(String metodo, String caminho) {
        return new MockHttpServletRequest(metodo, caminho);
    }

    private MockFilterChain executar(MockHttpServletRequest requisicao, MockHttpServletResponse resposta) throws Exception {
        MockFilterChain cadeia = new MockFilterChain();
        filtro.doFilter(requisicao, resposta, cadeia);
        return cadeia;
    }
}
