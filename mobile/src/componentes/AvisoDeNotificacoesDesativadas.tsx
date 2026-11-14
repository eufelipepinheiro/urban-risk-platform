import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { ALTURA_MINIMA_DE_TOQUE, coresDePrioridade } from '../tema/cores';

const paleta = coresDePrioridade.MEDIA;

export function AvisoDeNotificacoesDesativadas() {
  return (
    <View accessible accessibilityRole="summary" style={estilos.aviso}>
      <Text style={estilos.texto}>Notificações desativadas: você não será avisado de novos alertas de prioridade alta.</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityHint="Abre as configurações do aparelho"
        onPress={() => void Linking.openSettings()}
        style={estilos.botao}
      >
        <Text style={estilos.textoDoBotao}>Abrir configurações</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  aviso: { backgroundColor: paleta.fundo, borderRadius: 12, padding: 12, gap: 8 },
  texto: { fontSize: 15, color: paleta.texto },
  botao: { minHeight: ALTURA_MINIMA_DE_TOQUE, justifyContent: 'center', alignSelf: 'flex-start' },
  textoDoBotao: { fontSize: 15, fontWeight: '700', color: paleta.texto, textDecorationLine: 'underline' },
});
