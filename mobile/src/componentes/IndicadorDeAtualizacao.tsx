import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { INTERVALO_DE_ATUALIZACAO_MS } from '../api/config';
import { useAgora } from '../hooks/useAgora';
import { cores } from '../tema/cores';
import { formatarHorario } from '../utils/tempo';

interface Props {
  atualizadoEm: number;
  buscando: boolean;
}

export function IndicadorDeAtualizacao({ atualizadoEm, buscando }: Props) {
  const agora = useAgora(1000);
  const segundosDesdeAtualizacao = Math.max(0, Math.floor((agora - atualizadoEm) / 1000));
  const intervaloEmSegundos = INTERVALO_DE_ATUALIZACAO_MS / 1000;

  return (
    <View style={estilos.linha}>
      {buscando && <ActivityIndicator size="small" color={cores.primaria} />}
      <Text style={estilos.texto}>
        Atualizado às {formatarHorario(atualizadoEm)} (há {segundosDesdeAtualizacao} s) · a cada {intervaloEmSegundos} s
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 24 },
  texto: { flex: 1, fontSize: 13, color: cores.textoSecundario },
});
