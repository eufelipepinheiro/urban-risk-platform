package br.com.urbanrisk.domain;

public enum OrigemDado {
    SENSOR(NivelConfianca.ALTA),
    BASE_PUBLICA(NivelConfianca.MEDIA),
    REGISTRO_COMUNITARIO(NivelConfianca.BAIXA);

    private final NivelConfianca confiancaPadrao;

    OrigemDado(NivelConfianca confiancaPadrao) {
        this.confiancaPadrao = confiancaPadrao;
    }

    // A confiança nasce da origem; fases futuras podem refiná-la por corroboração entre fontes.
    public NivelConfianca confiancaPadrao() {
        return confiancaPadrao;
    }
}
