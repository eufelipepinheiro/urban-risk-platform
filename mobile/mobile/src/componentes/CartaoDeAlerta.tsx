import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Alerta } from '../api/tipos';
import { ALTURA_MINIMA_DE_TOQUE, cores } from '../tema/cores';
import { descreverTempoDecorrido } from '../utils/tempo';
import { ROTULO_CONFIANCA, ROTULO_ORIGEM, ROTULO_PRIORIDADE, ROTULO_TIPO } from '../utils/rotulos';
import { IconeDeTipo } from './IconeDeTipo';
import { SeloDePrioridade } from './SeloDePrioridade';

interface Props {
  alerta: Alerta;
  agora: number;
  aoPressionar: (eventoId: number) => void;
}

function montarRotuloAcessivel(alerta: Alerta, quando: string): string {
  const { evento, prioridade, pontuacao } = alerta;
  return [
    `${ROTULO_TIPO[evento.tipo]}, ${ROTULO_PRIORIDADE[prioridade].toLowerCase()}, ${Math.round(pontuacao)} pontos.`,
    `${evento.descricao ?? 'Sem descrição'}.`,
    `Fonte: ${ROTULO_ORIGEM[evento.origem]}, ${evento.nomeFonte}, confiança ${ROTULO_CONFIANCA[evento.confianca]}.`,
    `${quando}.`,
  ].join(' ');
}

export function CartaoDeAlerta({ alerta, agora, aoPressionar }: Props) {
  const { evento, prioridade, pontuacao } = alerta;
  const quando = descreverTempoDecorrido(evento.ocorridoEm, agora);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={montarRotuloAcessivel(alerta, quando)}
      accessibilityHint="Abre os detalhes do alerta"
      onPress={() => aoPressionar(evento.id)}
      style={({ pressed }) => [estilos.cartao, pressed && estilos.pressionado]}
    >
      <View style={estilos.linhaSuperior}>
        <SeloDePrioridade prioridade={prioridade} />
        <Text style={estilos.pontos}>{Math.round(pontuacao)} pts</Text>
      </View>
      <View style={estilos.linhaDoTitulo}>
        <IconeDeTipo tipo={evento.tipo} />
        <Text style={estilos.titulo}>{ROTULO_TIPO[evento.tipo]}</Text>
      </View>
      <Text style={estilos.descricao}>{evento.descricao ?? 'Sem descrição'}</Text>
      <Text style={estilos.meta}>
        {ROTULO_ORIGEM[evento.origem]} · {evento.nomeFonte}
      </Text>
      <Text style={estilos.meta}>
        Confiança {ROTULO_CONFIANCA[evento.confianca]} · {quando}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    minHeight: ALTURA_MINIMA_DE_TOQUE,
    backgroundColor: cores.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 16,
    gap: 6,
  },
  pressionado: { opacity: 0.7 },
  linhaSuperior: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  linhaDoTitulo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pontos: { fontSize: 16, fontWeight: '700', color: cores.texto },
  titulo: { fontSize: 18, fontWeight: '700', color: cores.texto },
  descricao: { fontSize: 16, color: cores.texto },
  meta: { fontSize: 14, color: cores.textoSecundario },
});
