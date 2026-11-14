import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { ErroDeApi } from '../api/cliente';
import { INTERVALO_DE_ATUALIZACAO_MS } from '../api/config';
import { listarAlertas } from '../api/servicos';
import { proximoEstadoDaConexao, useStatusDaConexao } from './useStatusDaConexao';

jest.mock('../api/servicos');

const listarAlertasSimulado = jest.mocked(listarAlertas);

function criarEnvoltorio() {
  const cliente = new QueryClient({ defaultOptions: { queries: { retry: false, networkMode: 'always' } } });
  return function Envoltorio({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={cliente}>{children}</QueryClientProvider>;
  };
}

const avancarTempo = (milissegundos: number) =>
  act(async () => {
    await jest.advanceTimersByTimeAsync(milissegundos);
  });

afterEach(() => {
  jest.useRealTimers();
});

describe('proximoEstadoDaConexao', () => {
  it.each([
    ['conectado', true, 'desconectado'],
    ['desconectado', true, 'desconectado'],
    ['desconectado', false, 'reconectado'],
    ['reconectado', false, 'reconectado'],
    ['conectado', false, 'conectado'],
  ] as const)('de %s com falha=%s vai para %s', (anterior, houveFalha, esperado) => {
    expect(proximoEstadoDaConexao(anterior, houveFalha)).toBe(esperado);
  });
});

describe('useStatusDaConexao', () => {
  it('detecta a queda do backend, mantém o app de pé e avisa quando ele volta', async () => {
    jest.useFakeTimers();
    listarAlertasSimulado.mockResolvedValue([]);
    const { result } = await renderHook(() => useStatusDaConexao(), { wrapper: criarEnvoltorio() });

    await waitFor(() => expect(result.current.ultimaAtualizacao).toBeGreaterThan(0));
    const atualizacaoAntesDaQueda = result.current.ultimaAtualizacao;
    expect(result.current.estado).toBe('conectado');

    listarAlertasSimulado.mockRejectedValue(new ErroDeApi('Sem conexão com o servidor', 'rede'));
    await avancarTempo(INTERVALO_DE_ATUALIZACAO_MS);
    expect(result.current.estado).toBe('desconectado');
    expect(result.current.causa).toBe('rede');
    expect(result.current.ultimaAtualizacao).toBe(atualizacaoAntesDaQueda);

    listarAlertasSimulado.mockResolvedValue([]);
    await avancarTempo(INTERVALO_DE_ATUALIZACAO_MS);
    expect(result.current.estado).toBe('reconectado');

    await avancarTempo(4000);
    expect(result.current.estado).toBe('conectado');
  });
});
