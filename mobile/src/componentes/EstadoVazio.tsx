import { StyleSheet, Text, View } from 'react-native';
import { cores } from '../tema/cores';

interface Props {
  titulo: string;
  mensagem: string;
}

export function EstadoVazio({ titulo, mensagem }: Props) {
  return (
    <View style={estilos.centro}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.mensagem}>{mensagem}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: { alignItems: 'center', gap: 8, padding: 32 },
  titulo: { fontSize: 18, fontWeight: '700', color: cores.texto, textAlign: 'center' },
  mensagem: { fontSize: 16, color: cores.textoSecundario, textAlign: 'center' },
});
