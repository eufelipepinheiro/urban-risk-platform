import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { AccessibilityInfo, Pressable, StyleSheet, Text, View } from 'react-native';
import { ALTURA_MINIMA_DE_TOQUE, cores } from '../tema/cores';
import { formatarHorario } from '../utils/tempo';
import type { StatusDaConexao } from '../hooks/useStatusDaConexao';

type Props = StatusDaConexao;

function descreverFalha(causa: StatusDaConexao['causa']): string {
  return causa === 'servidor' ? 'Servidor com problemas' : 'Sem conexão com o servidor';
}

export function BannerDeConexao({ estado, causa, ultimaAtualizacao, tentarAgora }: Props) {
  const titulo = estado === 'desconectado' ? descreverFalha(causa) : 'Conexão restabelecida';

  useEffect(() => {
    if (estado !== 'conectado') {
      AccessibilityInfo.announceForAccessibility(titulo);
    }
  }, [estado, titulo]);

  if (estado === 'conectado') {
    return null;
  }

  if (estado === 'reconectado') {
    return (
      <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={[estilos.banner, estilos.sucesso]}>
        <Ionicons name="checkmark-circle" size={22} color={cores.sobrePrimaria} accessibilityElementsHidden importantForAccessibility="no" />
        <View style={estilos.textos}>
          <Text style={estilos.titulo}>{titulo}</Text>
          <Text style={estilos.detalhe}>Os dados voltaram a ser atualizados.</Text>
        </View>
      </View>
    );
  }

  const detalhe =
    ultimaAtualizacao > 0
      ? `Mostrando dados de ${formatarHorario(ultimaAtualizacao)}. Tentando reconectar…`
      : 'Tentando reconectar…';

  return (
    <View accessibilityRole="alert" accessibilityLiveRegion="assertive" style={[estilos.banner, estilos.falha]}>
      <Ionicons name="cloud-offline" size={22} color={cores.sobrePrimaria} accessibilityElementsHidden importantForAccessibility="no" />
      <View style={estilos.textos}>
        <Text style={estilos.titulo}>{titulo}</Text>
        <Text style={estilos.detalhe}>{detalhe}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Tentar reconectar agora"
        onPress={tentarAgora}
        style={estilos.botao}
      >
        <Text style={estilos.textoDoBotao}>Tentar agora</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10 },
  falha: { backgroundColor: cores.erro },
  sucesso: { backgroundColor: cores.sucesso },
  textos: { flex: 1 },
  titulo: { fontSize: 16, fontWeight: '700', color: cores.sobrePrimaria },
  detalhe: { fontSize: 13, color: cores.sobrePrimaria },
  botao: {
    minHeight: ALTURA_MINIMA_DE_TOQUE,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: cores.sobrePrimaria,
  },
  textoDoBotao: { fontSize: 14, fontWeight: '700', color: cores.sobrePrimaria },
});
