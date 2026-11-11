package br.com.urbanrisk.domain;

import java.time.Duration;

// Limiares e meias-vidas didáticos (cm de nível d'água, °C, % de clientes sem serviço); calibrar com dados reais.
public enum TipoEvento {
    ALAGAMENTO("cm", 30, 60, 100, Duration.ofHours(3)),
    ILHA_DE_CALOR("°C", 32, 36, 40, Duration.ofHours(6)),
    INTERRUPCAO_SERVICO("%", 5, 20, 50, Duration.ofHours(4));

    private final String unidade;
    private final double limiarModerada;
    private final double limiarAlta;
    private final double limiarCritica;
    private final Duration meiaVida;

    TipoEvento(String unidade, double limiarModerada, double limiarAlta, double limiarCritica, Duration meiaVida) {
        this.unidade = unidade;
        this.limiarModerada = limiarModerada;
        this.limiarAlta = limiarAlta;
        this.limiarCritica = limiarCritica;
        this.meiaVida = meiaVida;
    }

    public Gravidade gravidadePara(double leitura) {
        if (leitura >= limiarCritica) {
            return Gravidade.CRITICA;
        }
        if (leitura >= limiarAlta) {
            return Gravidade.ALTA;
        }
        if (leitura >= limiarModerada) {
            return Gravidade.MODERADA;
        }
        return Gravidade.BAIXA;
    }

    public String unidade() {
        return unidade;
    }

    public Duration meiaVida() {
        return meiaVida;
    }
}
