package br.com.urbanrisk.simulacao;

import br.com.urbanrisk.domain.LeituraDeSensor;
import br.com.urbanrisk.domain.TipoEvento;
import br.com.urbanrisk.service.IngestaoService;
import java.util.List;
import java.util.Random;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Profile("demo")
public class SimuladorDeSensores {

    // Expoente > 1 concentra as leituras em valores baixos, com picos ocasionais como em episódios reais.
    private static final double EXPOENTE_DE_ASSIMETRIA = 2.5;

    private static final List<SensorSimulado> SENSORES = List.of(
            new SensorSimulado("SIM-ALAGAMENTO-01", TipoEvento.ALAGAMENTO, -23.6489, -46.8522, 0, 130),
            new SensorSimulado("SIM-ALAGAMENTO-02", TipoEvento.ALAGAMENTO, -23.6531, -46.8470, 0, 130),
            new SensorSimulado("SIM-CALOR-01", TipoEvento.ILHA_DE_CALOR, -23.6550, -46.8590, 24, 42),
            new SensorSimulado("SIM-CALOR-02", TipoEvento.ILHA_DE_CALOR, -23.6420, -46.8450, 24, 42),
            new SensorSimulado("SIM-ENERGIA-01", TipoEvento.INTERRUPCAO_SERVICO, -23.6500, -46.8600, 0, 60),
            new SensorSimulado("SIM-ENERGIA-02", TipoEvento.INTERRUPCAO_SERVICO, -23.6470, -46.8400, 0, 60));

    private final IngestaoService ingestao;
    private final Random sorteio = new Random();

    public SimuladorDeSensores(IngestaoService ingestao) {
        this.ingestao = ingestao;
    }

    @Scheduled(fixedRateString = "${urbanrisk.simulador.intervalo-ms:5000}")
    public void emitirLeitura() {
        SensorSimulado sensor = SENSORES.get(sorteio.nextInt(SENSORES.size()));
        double intensidade = Math.pow(sorteio.nextDouble(), EXPOENTE_DE_ASSIMETRIA);
        ingestao.registrarLeituraDeSensor(sensor.leitura(intensidade));
    }

    private record SensorSimulado(
            String id, TipoEvento tipo, double latitude, double longitude, double minimo, double maximo) {

        LeituraDeSensor leitura(double intensidade) {
            double valor = minimo + (maximo - minimo) * intensidade;
            return new LeituraDeSensor(id, tipo, valor, latitude, longitude, null);
        }
    }
}
