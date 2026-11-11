package br.com.urbanrisk.service;

import java.util.regex.Pattern;

public final class AnonimizadorDeTexto {

    private static final Pattern EMAIL = Pattern.compile("[\\w.+-]+@[\\w-]+(\\.[\\w-]+)+");
    private static final Pattern CPF = Pattern.compile("\\b\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}\\b");
    private static final Pattern TELEFONE = Pattern.compile("(?:\\+?55\\s?)?(?:\\(?\\d{2}\\)?[\\s-]?)?9?\\d{4}[\\s-]?\\d{4}");

    private AnonimizadorDeTexto() {
    }

    // A ordem importa: o CPF precisa ser removido antes que o padrão de telefone o consuma parcialmente.
    public static String anonimizar(String texto) {
        if (texto == null) {
            return null;
        }
        String semEmail = EMAIL.matcher(texto).replaceAll("[e-mail removido]");
        String semDocumento = CPF.matcher(semEmail).replaceAll("[documento removido]");
        return TELEFONE.matcher(semDocumento).replaceAll("[telefone removido]");
    }
}
