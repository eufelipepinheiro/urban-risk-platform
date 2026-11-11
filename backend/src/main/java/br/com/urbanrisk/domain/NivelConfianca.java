package br.com.urbanrisk.domain;

public enum NivelConfianca {
    BAIXA(0.4),
    MEDIA(0.7),
    ALTA(1.0);

    private final double peso;

    NivelConfianca(double peso) {
        this.peso = peso;
    }

    public double peso() {
        return peso;
    }
}
