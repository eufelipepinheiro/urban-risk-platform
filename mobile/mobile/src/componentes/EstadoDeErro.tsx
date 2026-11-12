import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ALTURA_MINIMA_DE_TOQUE, cores } from '../tema/cores';

interface Props {
  mensagem: string;
  aoTentarNovamente: () => void;
}

export function EstadoDeErro({ mensagem, aoTentarNovamente }: Props) {
  return (
    <View style={estilos.centro} accessibilityRole="alert">
      <Ionicons name="cloud-offline" size={48} color={cores.erro} accessibilityElementsHidden importantForAccessibility="no" />
      <Text style={estilos.titulo}>Não foi possível carregar os dados</Text>
      <Text style={estilos.mensagem}>{mensagem}</Text>
      <Pressable accessibilityRole="button" onPress={aoTentarNovamente} style={estilos.botao}>
        <Text style={estilos.textoDoBotao}>Tentar novamente</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  titulo: { fontSize: 20, fontWeight: '700', color: cores.texto, textAlign: 'center' },
  mensagem: { fontSize: 16, color: cores.textoSecundario, textAlign: 'center' },
  botao: {
    minHeight: ALTURA_MINIMA_DE_TOQUE,
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: cores.primaria,
  },
  textoDoBotao: { fontSize: 16, fontWeight: '700', color: cores.sobrePrimaria },
});
