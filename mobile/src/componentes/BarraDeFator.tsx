import { StyleSheet, Text, View } from 'react-native';
import { cores } from '../tema/cores';

interface Props {
  rotulo: string;
  explicacao: string;
  valor: number;
  pesoPercentual: number;
  contribuicaoEmPontos: number;
}

export function BarraDeFator({ rotulo, explicacao, valor, pesoPercentual, contribuicaoEmPontos }: Props) {
  const percentual = Math.round(valor * 100);

  return (
    <View
      accessible
      accessibilityLabel={`${rotulo}: ${percentual} por cento, peso ${pesoPercentual} por cento, contribui com ${contribuicaoEmPontos} pontos. ${explicacao}`}
      style={estilos.container}
    >
      <View style={estilos.cabecalho}>
        <Text style={estilos.rotulo}>
          {rotulo} <Text style={estilos.peso}>(peso {pesoPercentual}%)</Text>
        </Text>
        <Text style={estilos.pontos}>+{contribuicaoEmPontos} pts</Text>
      </View>
      <View style={estilos.trilho}>
        <View style={[estilos.preenchimento, { width: `${percentual}%` }]} />
      </View>
      <Text style={estilos.explicacao}>{explicacao}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { gap: 6 },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rotulo: { fontSize: 16, fontWeight: '700', color: cores.texto },
  peso: { fontSize: 14, fontWeight: '400', color: cores.textoSecundario },
  pontos: { fontSize: 16, fontWeight: '700', color: cores.primaria },
  trilho: { height: 10, borderRadius: 5, backgroundColor: cores.borda, overflow: 'hidden' },
  preenchimento: { height: 10, borderRadius: 5, backgroundColor: cores.primaria },
  explicacao: { fontSize: 14, color: cores.textoSecundario },
});
