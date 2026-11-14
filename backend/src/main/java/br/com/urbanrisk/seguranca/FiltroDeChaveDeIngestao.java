package br.com.urbanrisk.seguranca;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

// Cada origem tem a sua chave: o vazamento da chave comunitária não permite forjar leituras de sensor.
@Component
public class FiltroDeChaveDeIngestao extends OncePerRequestFilter {

    static final String CABECALHO_DA_CHAVE = "X-API-Key";

    private final Map<String, String> chavePorRota;

    public FiltroDeChaveDeIngestao(
            @Value("${urbanrisk.seguranca.chave-sensores:}") String chaveSensores,
            @Value("${urbanrisk.seguranca.chave-bases-publicas:}") String chaveBasesPublicas,
            @Value("${urbanrisk.seguranca.chave-comunitario:}") String chaveComunitario) {
        this.chavePorRota = Map.of(
                "/api/ingestao/sensores", chaveSensores,
                "/api/ingestao/bases-publicas", chaveBasesPublicas,
                "/api/ingestao/comunitario", chaveComunitario);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest requisicao, HttpServletResponse resposta, FilterChain cadeia)
            throws ServletException, IOException {
        String chaveEsperada = chavePorRota.get(requisicao.getRequestURI());
        boolean rotaProtegida = chaveEsperada != null;

        if (rotaProtegida && !chaveAceita(chaveEsperada, requisicao.getHeader(CABECALHO_DA_CHAVE))) {
            recusar(resposta);
            return;
        }
        cadeia.doFilter(requisicao, resposta);
    }

    // Chave não configurada recusa tudo (a ingestão nasce fechada); a comparação é em tempo constante.
    private boolean chaveAceita(String esperada, String recebida) {
        if (esperada.isBlank() || recebida == null) {
            return false;
        }
        return MessageDigest.isEqual(
                esperada.getBytes(StandardCharsets.UTF_8), recebida.getBytes(StandardCharsets.UTF_8));
    }

    private void recusar(HttpServletResponse resposta) throws IOException {
        resposta.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        resposta.setContentType("application/problem+json");
        resposta.setCharacterEncoding("UTF-8");
        resposta.getWriter().write(
                "{\"title\":\"Unauthorized\",\"status\":401,\"detail\":\"Chave de API ausente ou inválida\"}");
    }
}
