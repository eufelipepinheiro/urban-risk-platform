import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { comAvisoDeConexao } from '../componentes/MoldeDeTela';
import { AlertasTela } from '../telas/AlertasTela';
import { DetalheDoAlertaTela } from '../telas/DetalheDoAlertaTela';
import { EventosTela } from '../telas/EventosTela';
import { PainelTela } from '../telas/PainelTela';
import { cores } from '../tema/cores';
import type { NomeDeIcone } from '../tema/icones';
import { referenciaDeNavegacao } from './referencia';
import type { AbasParams, PilhaPrincipalParams } from './tipos';

const Abas = createBottomTabNavigator<AbasParams>();
const Pilha = createNativeStackNavigator<PilhaPrincipalParams>();

const PainelComAviso = comAvisoDeConexao(PainelTela);
const AlertasComAviso = comAvisoDeConexao(AlertasTela);
const EventosComAviso = comAvisoDeConexao(EventosTela);
const DetalheComAviso = comAvisoDeConexao(DetalheDoAlertaTela);

const opcoesDoCabecalho = {
  headerStyle: { backgroundColor: cores.primaria },
  headerTintColor: cores.sobrePrimaria,
  headerTitleStyle: { fontWeight: '700' as const },
};

function iconeDaAba(nome: NomeDeIcone) {
  return ({ color, size }: { color: string; size: number }) => <Ionicons name={nome} size={size} color={color} />;
}

function NavegacaoPorAbas() {
  return (
    <Abas.Navigator
      screenOptions={{
        ...opcoesDoCabecalho,
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarLabelStyle: { fontSize: 13, fontWeight: '600' },
      }}
    >
      <Abas.Screen
        name="Painel"
        component={PainelComAviso}
        options={{ title: 'Painel de risco', tabBarLabel: 'Painel', tabBarIcon: iconeDaAba('speedometer-outline') }}
      />
      <Abas.Screen
        name="Alertas"
        component={AlertasComAviso}
        options={{ title: 'Alertas priorizados', tabBarIcon: iconeDaAba('notifications-outline') }}
      />
      <Abas.Screen
        name="Eventos"
        component={EventosComAviso}
        options={{ title: 'Eventos recentes', tabBarIcon: iconeDaAba('list-outline') }}
      />
    </Abas.Navigator>
  );
}

export function NavegacaoPrincipal() {
  return (
    <NavigationContainer ref={referenciaDeNavegacao}>
      <Pilha.Navigator screenOptions={opcoesDoCabecalho}>
        <Pilha.Screen name="Abas" component={NavegacaoPorAbas} options={{ headerShown: false }} />
        <Pilha.Screen name="DetalheDoAlerta" component={DetalheComAviso} options={{ title: 'Detalhe do alerta' }} />
      </Pilha.Navigator>
    </NavigationContainer>
  );
}
