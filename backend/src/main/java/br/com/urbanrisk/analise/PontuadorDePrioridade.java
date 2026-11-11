package br.com.urbanrisk.analise;

import br.com.urbanrisk.domain.Evento;
import java.time.Clock;
import java.time.Duration;
import java.util.Collection;
import org.springframework.stereotype.Component;

@Component
public class PontuadorDePrioridade {

    private static final double PESO_GRAVIDADE = 0.45;
    private static final double PESO_CONFIANCA = 0.20;
    private static final double PESO_RECENCIA = 0.20;
    private static final double PESO_CORROBORACAO = 0.15;

    private static final double RAIO_DE_CORROBORACAO_KM = 1.0;
    private static final Duration JANELA_DE_CORROBORACAO = Duration.ofHours(2);
    private static final double EVIDENCIA_PARA_CORROBORACAO_TOTAL = 3.0;

    private static final double LIMIAR_PRIORIDADE_ALTA = 65;
    private static final double LIMIAR_PRIORIDADE_MEDIA = 40;

    private final Clock relogio;

    public PontuadorDePrioridade(Clock relogio) {
        this.relogio = relogio;
    }

    public PontuacaoDeAlerta pontuar(Evento evento, Collection<Evento> eventosRecentes) {
        var fatores = new FatoresDePrioridade(
                evento.getGravidade().peso(),
                evento.getConfianca().peso(),
                arredondar(recencia(evento), 2),
                arredondar(corroboracao(evento, eventosRecentes), 2));

        double pontos = arredondar(100 * (PESO_GRAVIDADE * fatores.gravidade()
                + PESO_CONFIANCA * fatores.confianca()
                + PESO_RECENCIA * fatores.recencia()
                + PESO_CORROBORACAO * fatores.corroboracao()), 1);

        return new PontuacaoDeAlerta(evento, pontos, prioridadePara(pontos), fatores);
    }

    // Decaimento exponencial: a relevância cai pela metade a cada meia-vida do tipo de evento.
    private double recencia(Evento evento) {
        Duration idade = Duration.between(evento.getOcorridoEm(), relogio.instant());
        if (idade.isNegative()) {
            return 1.0;
        }
        double meiasVidas = (double) idade.toMillis() / evento.getTipo().meiaVida().toMillis();
        return Math.pow(0.5, meiasVidas);
    }

    // Cada vizinho conta proporcionalmente à sua confiança, para que muitos relatos frágeis não simulem uma confirmação forte.
    private double corroboracao(Evento evento, Collection<Evento> eventosRecentes) {
        double evidencia = eventosRecentes.stream()
                .filter(outro -> outro != evento)
                .filter(outro -> outro.getTipo() == evento.getTipo())
                .filter(outro -> estaProximo(evento, outro) && ocorreuNaMesmaJanela(evento, outro))
                .mapToDouble(outro -> outro.getConfianca().peso())
                .sum();
        return Math.min(1.0, evidencia / EVIDENCIA_PARA_CORROBORACAO_TOTAL);
    }

    private boolean estaProximo(Evento a, Evento b) {
        return Distancia.emKm(a.getLatitude(), a.getLongitude(), b.getLatitude(), b.getLongitude())
                <= RAIO_DE_CORROBORACAO_KM;
    }

    private boolean ocorreuNaMesmaJanela(Evento a, Evento b) {
        return Duration.between(a.getOcorridoEm(), b.getOcorridoEm()).abs().compareTo(JANELA_DE_CORROBORACAO) <= 0;
    }

    private NivelPrioridade prioridadePara(double pontos) {
        if (pontos >= LIMIAR_PRIORIDADE_ALTA) {
            return NivelPrioridade.ALTA;
        }
        if (pontos >= LIMIAR_PRIORIDADE_MEDIA) {
            return NivelPrioridade.MEDIA;
        }
        return NivelPrioridade.BAIXA;
    }

    private static double arredondar(double valor, int casasDecimais) {
        double escala = Math.pow(10, casasDecimais);
        return Math.round(valor * escala) / escala;
    }
}
