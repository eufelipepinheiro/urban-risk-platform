package br.com.urbanrisk.analise;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;

import org.junit.jupiter.api.Test;

class DistanciaTest {

    @Test
    void pontosIguaisTemDistanciaZero() {
        assertThat(Distancia.emKm(-23.65, -46.85, -23.65, -46.85)).isZero();
    }

    @Test
    void centesimoDeGrauDeLatitudeEquivaleAProximamenteUmQuilometro() {
        assertThat(Distancia.emKm(-23.65, -46.85, -23.64, -46.85)).isCloseTo(1.112, within(0.01));
    }
}
