import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { ALTURA_MINIMA_DE_TOQUE, cores } from '../tema/cores';
import type { OpcaoDeFiltro } from '../utils/opcoesDeFiltro';

interface Props<T extends string> {
  rotuloDoGrupo: string;
  opcoes: OpcaoDeFiltro<T>[];
  selecionado: T | undefined;
  aoSelecionar: (valor: T | undefined) => void;
}

export function FiltroDeOpcoes<T extends string>({ rotuloDoGrupo, opcoes, selecionado, aoSelecionar }: Props<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityRole="radiogroup"
      accessibilityLabel={rotuloDoGrupo}
      contentContainerStyle={estilos.linha}
    >
      {opcoes.map((opcao) => {
        const ativa = opcao.valor === selecionado;
        return (
          <Pressable
            key={opcao.valor ?? 'todos'}
            accessibilityRole="radio"
            accessibilityState={{ checked: ativa }}
            accessibilityLabel={opcao.rotulo}
            onPress={() => aoSelecionar(opcao.valor)}
            style={[estilos.opcao, ativa && estilos.opcaoAtiva]}
          >
            <Text style={[estilos.texto, ativa && estilos.textoAtivo]}>{opcao.rotulo}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  linha: { gap: 8, paddingVertical: 4 },
  opcao: {
    minHeight: ALTURA_MINIMA_DE_TOQUE,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  opcaoAtiva: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  texto: { fontSize: 16, fontWeight: '600', color: cores.texto },
  textoAtivo: { color: cores.sobrePrimaria },
});
