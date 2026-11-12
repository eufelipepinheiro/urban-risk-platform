import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarraDeFator } from '../componentes/BarraDeFator';
import { EstadoDeCarregamento } from '../componentes/EstadoDeCarregamento';
import { EstadoVazio } from '../componentes/EstadoVazio';
import { IconeDeTipo } from '../componentes/IconeDeTipo';
import { SeloDePrioridade } from '../componentes/SeloDePrioridade';
import { useAlertas } from '../hooks/useAlertas';
import type { PilhaPrincipalParams } from '../navegacao/tipos';
import { ALTURA_MINIMA_DE_TOQUE, cores } from '../tema/cores';
import { calcularContribuicaoEmPontos, FATORES_DE_PRIORIDADE } from '../utils/fatores';
import { ROTULO_CONFIANCA, ROTULO_GRAVIDADE, ROTULO_ORIGEM, ROTULO_TIPO } from '../utils/rotulos';
import { formatarDataHora } from '../utils/tempo';

type Props = NativeStackScreenProps<PilhaPrincipalParams, 'DetalheDoAlerta'>;

function LinhaDeInformacao({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View accessible accessibilityLabel={`${rotulo}: ${valor}`} style={estilos.linhaDeInformacao}>
      <Text style={estilos.rotuloDaInformacao}>{rotulo}</Text>
      <Text style={estilos.valorDaInformacao}>{valor}</Text>
    </View>
  );
}

export function DetalheDoAlertaTela({ route }: Props) {
  const { eventoId } = route.params;
  const consulta = useAlertas();
  const alerta = consulta.data?.find((item) => item.evento.id === eventoId);

  if (consulta.isPending) {
    return <EstadoDeCarregamento mensagem="Carregando alerta…" />;
  }
  if (!alerta) {
    return (
      <EstadoVazio
        titulo="Este alerta não está mais ativo"
        mensagem="Ele saiu da janela de 24 horas ou do ranking atual."
      />
    );
  }

  const { evento, prioridade, pontuacao, fatores } = alerta;

  const abrirNoMapa = () =>
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${evento.latitude},${evento.longitude}`,
    ).catch(() => Alert.alert('Não foi possível abrir o mapa neste dispositivo.'));

  return (
    <ScrollView contentContainerStyle={estilos.conteudo}>
      <View style={estilos.cabecalho}>
        <SeloDePrioridade prioridade={prioridade} />
        <Text accessibilityLabel={`${Math.round(pontuacao)} pontos de 100`} style={estilos.pontuacao}>
          {Math.round(pontuacao)}
          <Text style={estilos.pontuacaoMaxima}> / 100</Text>
        </Text>
      </View>

      <View style={estilos.titulo}>
        <IconeDeTipo tipo={evento.tipo} tamanho={28} />
        <Text accessibilityRole="header" style={estilos.nomeDoTipo}>
          {ROTULO_TIPO[evento.tipo]}
        </Text>
      </View>
      <Text style={estilos.descricao}>{evento.descricao ?? 'Sem descrição'}</Text>

      <Text accessibilityRole="header" style={estilos.secao}>
        Por que esta prioridade
      </Text>
      <View style={estilos.fatores}>
        {FATORES_DE_PRIORIDADE.map((fator) => (
          <BarraDeFator
            key={fator.chave}
            rotulo={fator.rotulo}
            explicacao={fator.explicacao}
            valor={fatores[fator.chave]}
            pesoPercentual={fator.pesoPercentual}
            contribuicaoEmPontos={calcularContribuicaoEmPontos(fator, fatores)}
          />
        ))}
      </View>

      <Text accessibilityRole="header" style={estilos.secao}>
        Origem do dado
      </Text>
      <View style={estilos.informacoes}>
        <LinhaDeInformacao rotulo="Origem" valor={ROTULO_ORIGEM[evento.origem]} />
        <LinhaDeInformacao rotulo="Fonte" valor={evento.nomeFonte} />
        <LinhaDeInformacao rotulo="Confiança" valor={ROTULO_CONFIANCA[evento.confianca]} />
        <LinhaDeInformacao rotulo="Gravidade" valor={ROTULO_GRAVIDADE[evento.gravidade]} />
        <LinhaDeInformacao rotulo="Ocorrido em" valor={formatarDataHora(evento.ocorridoEm)} />
        <LinhaDeInformacao rotulo="Registrado em" valor={formatarDataHora(evento.registradoEm)} />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityHint="Abre o aplicativo de mapas"
        onPress={abrirNoMapa}
        style={estilos.botaoDoMapa}
      >
        <Text style={estilos.textoDoBotao}>Ver localização no mapa</Text>
      </Pressable>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: 16, gap: 12, backgroundColor: cores.fundo },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pontuacao: { fontSize: 36, fontWeight: '800', color: cores.texto },
  pontuacaoMaxima: { fontSize: 18, fontWeight: '400', color: cores.textoSecundario },
  titulo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nomeDoTipo: { fontSize: 24, fontWeight: '800', color: cores.texto },
  descricao: { fontSize: 18, color: cores.texto },
  secao: { fontSize: 20, fontWeight: '800', color: cores.texto, marginTop: 8 },
  fatores: {
    gap: 16,
    backgroundColor: cores.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 16,
  },
  informacoes: {
    gap: 10,
    backgroundColor: cores.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 16,
  },
  linhaDeInformacao: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  rotuloDaInformacao: { fontSize: 16, color: cores.textoSecundario },
  valorDaInformacao: { flex: 1, fontSize: 16, fontWeight: '600', color: cores.texto, textAlign: 'right' },
  botaoDoMapa: {
    minHeight: ALTURA_MINIMA_DE_TOQUE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: cores.primaria,
    marginTop: 8,
  },
  textoDoBotao: { fontSize: 16, fontWeight: '700', color: cores.sobrePrimaria },
});
