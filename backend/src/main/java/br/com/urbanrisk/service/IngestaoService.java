package br.com.urbanrisk.service;

import br.com.urbanrisk.domain.Evento;
import br.com.urbanrisk.domain.LeituraDeSensor;
import br.com.urbanrisk.domain.NovoEvento;
import br.com.urbanrisk.domain.OcorrenciaPublica;
import br.com.urbanrisk.domain.OrigemDado;
import br.com.urbanrisk.domain.RegistroComunitario;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IngestaoService {

    private static final String FONTE_COMUNITARIA = "Registro comunitário";
    private static final Locale PORTUGUES_BRASIL = Locale.forLanguageTag("pt-BR");

    private final EventoService eventos;

    public IngestaoService(EventoService eventos) {
        this.eventos = eventos;
    }

    @Transactional
    public Evento registrarLeituraDeSensor(LeituraDeSensor leitura) {
        return eventos.registrar(new NovoEvento(
                leitura.tipo(),
                OrigemDado.SENSOR,
                leitura.sensorId(),
                leitura.tipo().gravidadePara(leitura.valor()),
                leitura.latitude(),
                leitura.longitude(),
                descrever(leitura),
                leitura.medidoEm()));
    }

    @Transactional
    public List<Evento> registrarOcorrenciasPublicas(List<OcorrenciaPublica> ocorrencias) {
        return ocorrencias.stream().map(this::registrarOcorrenciaPublica).toList();
    }

    @Transactional
    public Evento registrarRegistroComunitario(RegistroComunitario registro) {
        return eventos.registrar(new NovoEvento(
                registro.tipo(),
                OrigemDado.REGISTRO_COMUNITARIO,
                FONTE_COMUNITARIA,
                registro.gravidade(),
                registro.latitude(),
                registro.longitude(),
                AnonimizadorDeTexto.anonimizar(registro.descricao()),
                null));
    }

    private Evento registrarOcorrenciaPublica(OcorrenciaPublica ocorrencia) {
        return eventos.registrar(new NovoEvento(
                ocorrencia.tipo(),
                OrigemDado.BASE_PUBLICA,
                ocorrencia.nomeFonte(),
                ocorrencia.gravidade(),
                ocorrencia.latitude(),
                ocorrencia.longitude(),
                ocorrencia.descricao(),
                ocorrencia.ocorridoEm()));
    }

    private String descrever(LeituraDeSensor leitura) {
        return String.format(PORTUGUES_BRASIL, "Leitura de %.1f %s", leitura.valor(), leitura.tipo().unidade());
    }
}
