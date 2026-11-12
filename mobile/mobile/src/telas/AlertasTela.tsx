import { useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import type { TipoEvento } from '../api/tipos';
import { CartaoDeAlerta } from '../componentes/CartaoDeAlerta';
import { EstadoDeCarregamento } from '../componentes/EstadoDeCarregamento';
import { EstadoDeErro } from '../componentes/EstadoDeErro';
import { EstadoVazio } from '../componentes/EstadoVazio';
import { FiltroDeOpcoes } from '../componentes/FiltroDeOpcoes';
import { IndicadorDeAtualizacao } from '../componentes/IndicadorDeAtualizacao';
import { useAgora } from '../hooks/useAgora';
import { useAlertas } from '../hooks/useAlertas';
import { useAtualizacaoManual } from '../hooks/useAtualizacaoManual';
import type { NavegacaoDasAbas } from '../navegacao/tipos';
import { cores } from '../tema/cores';
import { OPCOES_DE_TIPO } from '../utils/opcoesDeFiltro';

const INTERVALO_DE_RELOGIO_MS = 15_000;

export function AlertasTela() {
  const navegacao = useNavigation<NavegacaoDasAbas>();
  const consulta = useAlertas();
  const agora = useAgora(INTERVALO_DE_RELOGIO_MS);
  const { atualizando, aoAtualizar } = useAtualizacaoManual(consulta.refetch);
  const [tipo, setTipo] = useState<TipoEvento | undefined>(undefined);

  const alertasFiltrados = useMemo(
    () => (consulta.data ?? []).filter((alerta) => tipo === undefined || alerta.evento.tipo === tipo),
    [consulta.data, tipo],
  );

  if (consulta.isPending) {
    return <EstadoDeCarregamento mensagem="Carregando alertas…" />;
  }
  if (consulta.data === undefined) {
    return <EstadoDeErro mensagem={consulta.error.message} aoTentarNovamente={() => consulta.refetch()} />;
  }

  return (
    <FlatList
      data={alertasFiltrados}
      keyExtractor={(alerta) => String(alerta.evento.id)}
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
            rotuloDoGrupo="Filtrar alertas por tipo"
            opcoes={OPCOES_DE_TIPO}
            selecionado={tipo}
            aoSelecionar={setTipo}
          />
        </View>
      }
      ListEmptyComponent={
        <EstadoVazio titulo="Nenhum alerta neste filtro" mensagem="Tente outro tipo ou aguarde novas ocorrências." />
      }
      renderItem={({ item }) => (
        <CartaoDeAlerta
          alerta={item}
          agora={agora}
          aoPressionar={(eventoId) => navegacao.navigate('DetalheDoAlerta', { eventoId })}
        />
      )}
    />
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: 16, backgroundColor: cores.fundo },
  cabecalho: { gap: 8, marginBottom: 12 },
  separador: { height: 12 },
});
