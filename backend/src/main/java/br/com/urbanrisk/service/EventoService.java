package br.com.urbanrisk.service;

import static br.com.urbanrisk.repository.EventoSpecifications.comOrigem;
import static br.com.urbanrisk.repository.EventoSpecifications.comTipo;

import br.com.urbanrisk.domain.Evento;
import br.com.urbanrisk.domain.NovoEvento;
import br.com.urbanrisk.domain.OrigemDado;
import br.com.urbanrisk.domain.TipoEvento;
import br.com.urbanrisk.repository.EventoRepository;
import java.time.Clock;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EventoService {

    private static final int LIMITE_MINIMO_LISTAGEM = 1;
    private static final int LIMITE_MAXIMO_LISTAGEM = 200;

    private final EventoRepository repositorio;
    private final Clock relogio;

    public EventoService(EventoRepository repositorio, Clock relogio) {
        this.repositorio = repositorio;
        this.relogio = relogio;
    }

    @Transactional
    public Evento registrar(NovoEvento dados) {
        return repositorio.save(new Evento(dados, relogio.instant()));
    }

    @Transactional(readOnly = true)
    public List<Evento> listar(TipoEvento tipo, OrigemDado origem, int limite) {
        var filtros = Specification.where(comTipo(tipo)).and(comOrigem(origem));
        var maisRecentesPrimeiro = PageRequest.of(0, limitarListagem(limite), Sort.by(Sort.Direction.DESC, "ocorridoEm"));
        return repositorio.findAll(filtros, maisRecentesPrimeiro).getContent();
    }

    @Transactional(readOnly = true)
    public Evento buscarPorId(Long id) {
        return repositorio.findById(id).orElseThrow(() -> new EventoNaoEncontradoException(id));
    }

    private int limitarListagem(int limite) {
        return Math.max(LIMITE_MINIMO_LISTAGEM, Math.min(limite, LIMITE_MAXIMO_LISTAGEM));
    }
}
