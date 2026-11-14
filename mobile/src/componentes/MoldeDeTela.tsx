import type { ComponentType, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerDeConexao } from './BannerDeConexao';
import { useConexao } from './ProvedorDeConexao';

export function MoldeDeTela({ children }: { children: ReactNode }) {
  const conexao = useConexao();
  return (
    <View style={estilos.tela}>
      <BannerDeConexao {...conexao} />
      <View style={estilos.conteudo}>{children}</View>
    </View>
  );
}

export function comAvisoDeConexao<P extends object>(Tela: ComponentType<P>) {
  return function TelaComAvisoDeConexao(propriedades: P) {
    return (
      <MoldeDeTela>
        <Tela {...propriedades} />
      </MoldeDeTela>
    );
  };
}

const estilos = StyleSheet.create({
  tela: { flex: 1 },
  conteudo: { flex: 1 },
});
