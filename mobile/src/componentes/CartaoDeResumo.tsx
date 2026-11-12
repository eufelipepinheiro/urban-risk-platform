import { StyleSheet, Text, View } from 'react-native';
import type { NivelPrioridade } from '../api/tipos';
import { coresDePrioridade } from '../tema/cores';
import { ROTULO_PRIORIDADE } from '../utils/rotulos';

interface Props {
  prioridade: NivelPrioridade;
  quantidade: number;
}

export function CartaoDeResumo({ prioridade, quantidade }: Props) {
  const paleta = coresDePrioridade[prioridade];
  const rotulo = ROTULO_PRIORIDADE[prioridade];
  const substantivo = quantidade === 1 ? 'alerta' : 'alertas';

  return (
    <View
      accessible
      accessibilityLabel={`${quantidade} ${substantivo} de ${rotulo.toLowerCase()}`}
      style={[estilos.cartao, { backgroundColor: paleta.fundo }]}
    >
      <Text style={[estilos.numero, { color: paleta.texto }]}>{quantidade}</Text>
      <Text style={[estilos.rotulo, { color: paleta.texto }]}>{rotulo}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center', gap: 2 },
  numero: { fontSize: 32, fontWeight: '800' },
  rotulo: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
});
