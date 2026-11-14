import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import type { AppStateStatus } from 'react-native';
import { ProvedorDeConexao } from './src/componentes/ProvedorDeConexao';
import { NavegacaoPrincipal } from './src/navegacao/NavegacaoPrincipal';
import { useNotificacoesDeAlerta } from './src/notificacoes/useNotificacoesDeAlerta';

// networkMode 'always': as tentativas continuam mesmo que o aparelho se julgue offline, o que garante a reconexão automática.
const clienteDeConsultas = new QueryClient({
  defaultOptions: { queries: { retry: 1, networkMode: 'always' } },
});

// Ao voltar para o app, o React Query atualiza os dados na hora em vez de esperar o próximo ciclo.
function sincronizarFocoComEstadoDoApp(estado: AppStateStatus) {
  focusManager.setFocused(estado === 'active');
}

function MonitorDeNotificacoes() {
  useNotificacoesDeAlerta();
  return null;
}

export default function App() {
  useEffect(() => {
    const assinatura = AppState.addEventListener('change', sincronizarFocoComEstadoDoApp);
    return () => assinatura.remove();
  }, []);

  return (
    <QueryClientProvider client={clienteDeConsultas}>
      <ProvedorDeConexao>
        <MonitorDeNotificacoes />
        <NavegacaoPrincipal />
        <StatusBar style="light" />
      </ProvedorDeConexao>
    </QueryClientProvider>
  );
}
