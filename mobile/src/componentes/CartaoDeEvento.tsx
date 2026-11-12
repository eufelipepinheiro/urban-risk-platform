import { StyleSheet, Text, View } from 'react-native';
import type { Evento } from '../api/tipos';
import { cores } from '../tema/cores';
import { ROTULO_CONFIANCA, ROTULO_GRAVIDADE, ROTULO_ORIGEM, ROTULO_TIPO } from '../utils/rotulos';
import { descreverTempoDecorrido } from '../utils/tempo';
import { IconeDeTipo } from './IconeDeTipo';

interface Props {
  evento: Evento;
  agora: number;
}

export function CartaoDeEvento({ evento, agora }: Props) {
  const quando = descreverTempoDecorrido(evento.ocorridoEm, agora);
  const descricao = evento.descricao ?? 'Sem descrição';

  return (
    <View
      accessible
      accessibilityLabel={[
        `${ROTULO_TIPO[evento.tipo]}, gravidade ${ROTULO_GRAVIDADE[evento.gravidade]}.`,
        `${descricao}.`,
        `Fonte: ${ROTULO_ORIGEM[evento.origem]}, ${evento.nomeFonte}, confiança ${ROTULO_CONFIANCA[evento.confianca]}.`,
        `${quando}.`,
      ].join(' ')}
      style={estilos.cartao}
    >
      <View style={estilos.linhaDoTitulo}>
        <IconeDeTipo tipo={evento.tipo} />
        <Text style={estilos.titulo}>{ROTULO_TIPO[evento.tipo]}</Text>
        <Text style={estilos.gravidade}>Gravidade {ROTULO_GRAVIDADE[evento.gravidade]}</Text>
      </View>
      <Text style={estilos.descricao}>{descricao}</Text>
      <Text style={estilos.meta}>
        {ROTULO_ORIGEM[evento.origem]} · {evento.nomeFonte}
      </Text>
      <Text style={estilos.meta}>
        Confiança {ROTULO_CONFIANCA[evento.confianca]} · {quando}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 16,
    gap: 6,
  },
  linhaDoTitulo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  titulo: { flex: 1, fontSize: 18, fontWeight: '700', color: cores.texto },
  gravidade: { fontSize: 14, fontWeight: '600', color: cores.textoSecundario },
  descricao: { fontSize: 16, color: cores.texto },
  meta: { fontSize: 14, color: cores.textoSecundario },
});
