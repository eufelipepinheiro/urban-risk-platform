import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type PilhaPrincipalParams = {
  Abas: undefined;
  DetalheDoAlerta: { eventoId: number };
};

export type AbasParams = {
  Painel: undefined;
  Alertas: undefined;
  Eventos: undefined;
};

export type NavegacaoDasAbas = CompositeNavigationProp<
  BottomTabNavigationProp<AbasParams>,
  NativeStackNavigationProp<PilhaPrincipalParams>
>;
