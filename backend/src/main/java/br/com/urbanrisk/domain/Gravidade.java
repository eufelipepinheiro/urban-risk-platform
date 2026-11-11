package br.com.urbanrisk.domain;

public enum Gravidade {
    BAIXA(0.25),
    MODERADA(0.50),
    ALTA(0.75),
    CRITICA(1.00);

    private final double peso;

    Gravidade(double peso) {
        this.peso = peso;
    }

    public double peso() {
        return peso;
    }
}
