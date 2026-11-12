import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import type { NivelPrioridade } from '../api/tipos';
import { coresDePrioridade } from '../tema/cores';
import type { NomeDeIcone } from '../tema/icones';
import { ROTULO_PRIORIDADE } from '../utils/rotulos';

const ICONE_DA_PRIORIDADE: Record<NivelPrioridade, NomeDeIcone> = {
  ALTA: 'warning',
  MEDIA: 'alert-circle',
  BAIXA: 'checkmark-circle',
};

interface Props {
  prioridade: NivelPrioridade;
}

// A prioridade é comunicada por ícone e texto, nunca apenas pela cor.
export function SeloDePrioridade({ prioridade }: Props) {
  const paleta = coresDePrioridade[prioridade];
  return (
    <View style={[estilos.selo, { backgroundColor: paleta.fundo }]}>
      <Ionicons
        name={ICONE_DA_PRIORIDADE[prioridade]}
        size={16}
        color={paleta.texto}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <Text style={[estilos.texto, { color: paleta.texto }]}>{ROTULO_PRIORIDADE[prioridade]}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  selo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  texto: { fontSize: 14, fontWeight: '700' },
});
