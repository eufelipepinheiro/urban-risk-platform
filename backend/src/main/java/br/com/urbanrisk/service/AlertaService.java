package br.com.urbanrisk.service;

import static br.com.urbanrisk.repository.EventoSpecifications.comTipo;
import static br.com.urbanrisk.repository.EventoSpecifications.ocorridoDesde;

import br.com.urbanrisk.analise.PontuacaoDeAlerta;
import br.com.urbanrisk.analise.PontuadorDePrioridade;
import br.com.urbanrisk.domain.Evento;
import br.com.urbanrisk.domain.TipoEvento;
import br.com.urbanrisk.repository.EventoRepository;
import java.time.Clock;
import java.time.Duration;
import java.util.Comparator;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AlertaService {

    private static final Duration JANELA_DE_ANALISE = Duration.ofHours(24);
    private static final int MAXIMO_DE_EVENTOS_ANALISADOS = 500;
    private static final int LIMITE_MINIMO = 1;
    private static final int LIMITE_MAXIMO = 100;

    private static final Comparator<PontuacaoDeAlerta> MAIOR_PRIORIDADE_PRIMEIRO =
            Comparator.comparingDouble(PontuacaoDeAlerta::pontos)
                    .thenComparing(alerta -> alerta.evento().getOcorridoEm())
                    .reversed();

    private final EventoRepository repositorio;
    private final PontuadorDePrioridade pontuador;
    private final Clock relogio;

    public AlertaService(EventoRepository repositorio, PontuadorDePrioridade pontuador, Clock relogio) {
        this.repositorio = repositorio;
        this.pontuador = pontuador;
        this.relogio = relogio;
    }

    @Transactional(readOnly = true)
    public List<PontuacaoDeAlerta> listarPriorizados(TipoEvento tipo, int limite) {
        List<Evento> recentes = buscarRecentes(tipo);
        return recentes.stream()
                .map(evento -> pontuador.pontuar(evento, recentes))
                .sorted(MAIOR_PRIORIDADE_PRIMEIRO)
                .limit(limitar(limite))
                .toList();
    }

    private List<Evento> buscarRecentes(TipoEvento tipo) {
        var inicioDaJanela = relogio.instant().minus(JANELA_DE_ANALISE);
        var filtros = Specification.where(ocorridoDesde(inicioDaJanela)).and(comTipo(tipo));
        var maisRecentesPrimeiro = PageRequest.of(0, MAXIMO_DE_EVENTOS_ANALISADOS, Sort.by(Sort.Direction.DESC, "ocorridoEm"));
        return repositorio.findAll(filtros, maisRecentesPrimeiro).getContent();
    }

    private int limitar(int limite) {
        return Math.max(LIMITE_MINIMO, Math.min(limite, LIMITE_MAXIMO));
    }
}
