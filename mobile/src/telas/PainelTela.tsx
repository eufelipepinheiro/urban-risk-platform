import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TIPOS_DE_EVENTO } from '../api/tipos';
import type { NivelPrioridade } from '../api/tipos';
import { CartaoDeAlerta } from '../componentes/CartaoDeAlerta';
import { CartaoDeResumo } from '../componentes/CartaoDeResumo';
import { EstadoDeCarregamento } from '../componentes/EstadoDeCarregamento';
import { EstadoDeErro } from '../componentes/EstadoDeErro';
import { EstadoVazio } from '../componentes/EstadoVazio';
import { IconeDeTipo } from '../componentes/IconeDeTipo';
import { IndicadorDeAtualizacao } from '../componentes/IndicadorDeAtualizacao';
import { SeloDePrioridade } from '../componentes/SeloDePrioridade';
import { useAgora } from '../hooks/useAgora';
import { useAlertas } from '../hooks/useAlertas';
import { useAtualizacaoManual } from '../hooks/useAtualizacaoManual';
import type { NavegacaoDasAbas } from '../navegacao/tipos';
import { ALTURA_MINIMA_DE_TOQUE, cores } from '../tema/cores';
import { resumirAlertas } from '../utils/resumo';
import { ROTULO_TIPO } from '../utils/rotulos';

const PRIORIDADES_EXIBIDAS: NivelPrioridade[] = ['ALTA', 'MEDIA', 'BAIXA'];
const INTERVALO_DE_RELOGIO_MS = 15_000;

export function PainelTela() {
  const navegacao = useNavigation<NavegacaoDasAbas>();
  const consulta = useAlertas();
  const agora = useAgora(INTERVALO_DE_RELOGIO_MS);
  const { atualizando, aoAtualizar } = useAtualizacaoManual(consulta.refetch);
  const resumo = useMemo(() => resumirAlertas(consulta.data ?? []), [consulta.data]);

  if (consulta.isPending) {
    return <EstadoDeCarregamento mensagem="Carregando alertas…" />;
  }
  if (consulta.data === undefined) {
    return <EstadoDeErro mensagem={consulta.error.message} aoTentarNovamente={() => consulta.refetch()} />;
  }

  const abrirDetalhe = (eventoId: number) => navegacao.navigate('DetalheDoAlerta', { eventoId });

  return (
    <ScrollView
      contentContainerStyle={estilos.conteudo}
      refreshControl={<RefreshControl refreshing={atualizando} onRefresh={aoAtualizar} />}
    >
      <IndicadorDeAtualizacao
        atualizadoEm={consulta.dataUpdatedAt}
        buscando={consulta.isFetching}
        falhou={consulta.isError}
      />

      <Text accessibilityRole="header" style={estilos.secao}>
        Alertas por prioridade
      </Text>
      <View style={estilos.linha}>
        {PRIORIDADES_EXIBIDAS.map((prioridade) => (
          <CartaoDeResumo key={prioridade} prioridade={prioridade} quantidade={resumo.porPrioridade[prioridade]} />
        ))}
      </View>

      <Text accessibilityRole="header" style={estilos.secao}>
        Por tipo de risco
      </Text>
      <View style={estilos.listaDeTipos}>
        {TIPOS_DE_EVENTO.map((tipo) => {
          const { total, maiorPrioridade } = resumo.porTipo[tipo];
          return (
            <View
              key={tipo}
              accessible
              accessibilityLabel={`${ROTULO_TIPO[tipo]}: ${total} alertas${maiorPrioridade ? `, maior prioridade ${maiorPrioridade.toLowerCase()}` : ''}`}
              style={estilos.linhaDeTipo}
            >
              <IconeDeTipo tipo={tipo} />
              <View style={estilos.textosDoTipo}>
                <Text style={estilos.nomeDoTipo}>{ROTULO_TIPO[tipo]}</Text>
                <Text style={estilos.totalDoTipo}>{total} alertas nas últimas 24 h</Text>
              </View>
              {maiorPrioridade && <SeloDePrioridade prioridade={maiorPrioridade} />}
            </View>
          );
        })}
      </View>

      <Text accessibilityRole="header" style={estilos.secao}>
        Mais urgentes agora
      </Text>
      {resumo.maisUrgentes.length === 0 ? (
        <EstadoVazio titulo="Nenhum alerta ativo" mensagem="Quando houver ocorrências, elas aparecem aqui." />
      ) : (
        resumo.maisUrgentes.map((alerta) => (
          <CartaoDeAlerta key={alerta.evento.id} alerta={alerta} agora={agora} aoPressionar={abrirDetalhe} />
        ))
      )}

      <Pressable
        accessibilityRole="button"
        onPress={() => navegacao.navigate('Alertas')}
        style={estilos.botaoVerTodos}
      >
        <Text style={estilos.textoDoBotao}>Ver todos os alertas</Text>
      </Pressable>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: 16, gap: 12, backgroundColor: cores.fundo },
  secao: { fontSize: 20, fontWeight: '800', color: cores.texto, marginTop: 8 },
  linha: { flexDirection: 'row', gap: 8 },
  listaDeTipos: { gap: 8 },
  linhaDeTipo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: ALTURA_MINIMA_DE_TOQUE,
    backgroundColor: cores.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 12,
  },
  textosDoTipo: { flex: 1 },
  nomeDoTipo: { fontSize: 16, fontWeight: '700', color: cores.texto },
  totalDoTipo: { fontSize: 14, color: cores.textoSecundario },
  botaoVerTodos: {
    minHeight: ALTURA_MINIMA_DE_TOQUE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: cores.primaria,
    marginTop: 8,
  },
  textoDoBotao: { fontSize: 16, fontWeight: '700', color: cores.sobrePrimaria },
});
