package br.com.urbanrisk.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "eventos", indexes = @Index(name = "idx_eventos_ocorrido_em", columnList = "ocorrido_em"))
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEvento tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrigemDado origem;

    @Column(nullable = false, length = 100)
    private String nomeFonte;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NivelConfianca confianca;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gravidade gravidade;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @Column(length = 500)
    private String descricao;

    @Column(name = "ocorrido_em", nullable = false)
    private Instant ocorridoEm;

    @Column(nullable = false)
    private Instant registradoEm;

    protected Evento() {
    }

    public Evento(NovoEvento dados, Instant registradoEm) {
        this.tipo = dados.tipo();
        this.origem = dados.origem();
        this.nomeFonte = dados.nomeFonte();
        this.confianca = dados.origem().confiancaPadrao();
        this.gravidade = dados.gravidade();
        this.latitude = dados.latitude();
        this.longitude = dados.longitude();
        this.descricao = dados.descricao();
        this.ocorridoEm = dados.ocorridoEmOu(registradoEm);
        this.registradoEm = registradoEm;
    }

    public Long getId() { return id; }
    public TipoEvento getTipo() { return tipo; }
    public OrigemDado getOrigem() { return origem; }
    public String getNomeFonte() { return nomeFonte; }
    public NivelConfianca getConfianca() { return confianca; }
    public Gravidade getGravidade() { return gravidade; }
    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }
    public String getDescricao() { return descricao; }
    public Instant getOcorridoEm() { return ocorridoEm; }
    public Instant getRegistradoEm() { return registradoEm; }
}
