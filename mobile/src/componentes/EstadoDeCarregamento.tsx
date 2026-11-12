import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { cores } from '../tema/cores';

interface Props {
  mensagem?: string;
}

export function EstadoDeCarregamento({ mensagem = 'Carregando dados…' }: Props) {
  return (
    <View style={estilos.centro} accessibilityLiveRegion="polite">
      <ActivityIndicator size="large" color={cores.primaria} />
      <Text style={estilos.texto}>{mensagem}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  texto: { fontSize: 16, color: cores.textoSecundario },
});
