import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import type { AppStateStatus } from 'react-native';
import { NavegacaoPrincipal } from './src/navegacao/NavegacaoPrincipal';

const clienteDeConsultas = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

// Ao voltar para o app, o React Query atualiza os dados na hora em vez de esperar o próximo ciclo.
function sincronizarFocoComEstadoDoApp(estado: AppStateStatus) {
  focusManager.setFocused(estado === 'active');
}

export default function App() {
  useEffect(() => {
    const assinatura = AppState.addEventListener('change', sincronizarFocoComEstadoDoApp);
    return () => assinatura.remove();
  }, []);

  return (
    <QueryClientProvider client={clienteDeConsultas}>
      <NavegacaoPrincipal />
      <StatusBar style="light" />
    </QueryClientProvider>
  );
}
