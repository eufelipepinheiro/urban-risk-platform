package br.com.urbanrisk.service;

public class EventoNaoEncontradoException extends RuntimeException {

    public EventoNaoEncontradoException(Long id) {
        super("Evento %d não encontrado".formatted(id));
    }
}
