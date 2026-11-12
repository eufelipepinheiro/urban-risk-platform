import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import type { OrigemDado, TipoEvento } from '../api/tipos';
import { CartaoDeEvento } from '../componentes/CartaoDeEvento';
import { EstadoDeCarregamento } from '../componentes/EstadoDeCarregamento';
import { EstadoDeErro } from '../componentes/EstadoDeErro';
import { EstadoVazio } from '../componentes/EstadoVazio';
import { FiltroDeOpcoes } from '../componentes/FiltroDeOpcoes';
import { IndicadorDeAtualizacao } from '../componentes/IndicadorDeAtualizacao';
import { useAgora } from '../hooks/useAgora';
import { useAtualizacaoManual } from '../hooks/useAtualizacaoManual';
import { useEventos } from '../hooks/useEventos';
import { cores } from '../tema/cores';
import { OPCOES_DE_ORIGEM, OPCOES_DE_TIPO } from '../utils/opcoesDeFiltro';

const INTERVALO_DE_RELOGIO_MS = 15_000;

export function EventosTela() {
  const consulta = useEventos();
  const agora = useAgora(INTERVALO_DE_RELOGIO_MS);
  const { atualizando, aoAtualizar } = useAtualizacaoManual(consulta.refetch);
  const [tipo, setTipo] = useState<TipoEvento | undefined>(undefined);
  const [origem, setOrigem] = useState<OrigemDado | undefined>(undefined);

  const eventosFiltrados = useMemo(
    () =>
      (consulta.data ?? []).filter(
        (evento) => (tipo === undefined || evento.tipo === tipo) && (origem === undefined || evento.origem === origem),
      ),
    [consulta.data, tipo, origem],
  );

  if (consulta.isPending) {
    return <EstadoDeCarregamento mensagem="Carregando eventos…" />;
  }
  if (consulta.data === undefined) {
    return <EstadoDeErro mensagem={consulta.error.message} aoTentarNovamente={() => consulta.refetch()} />;
  }

  return (
    <FlatList
      data={eventosFiltrados}
      keyExtractor={(evento) => String(evento.id)}
      extraData={agora}
      contentContainerStyle={estilos.conteudo}
      ItemSeparatorComponent={() => <View style={estilos.separador} />}
      refreshControl={<RefreshControl refreshing={atualizando} onRefresh={aoAtualizar} />}
      ListHeaderComponent={
        <View style={estilos.cabecalho}>
          <IndicadorDeAtualizacao
            atualizadoEm={consulta.dataUpdatedAt}
            buscando={consulta.isFetching}
            falhou={consulta.isError}
          />
          <FiltroDeOpcoes
            rotuloDoGrupo="Filtrar eventos por tipo"
            opcoes={OPCOES_DE_TIPO}
            selecionado={tipo}
            aoSelecionar={setTipo}
          />
          <FiltroDeOpcoes
            rotuloDoGrupo="Filtrar eventos por origem do dado"
            opcoes={OPCOES_DE_ORIGEM}
            selecionado={origem}
            aoSelecionar={setOrigem}
          />
        </View>
      }
      ListEmptyComponent={
        <EstadoVazio titulo="Nenhum evento neste filtro" mensagem="Tente outros filtros ou aguarde novos dados." />
      }
      renderItem={({ item }) => <CartaoDeEvento evento={item} agora={agora} />}
    />
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: 16, backgroundColor: cores.fundo },
  cabecalho: { gap: 8, marginBottom: 12 },
  separador: { height: 12 },
});
