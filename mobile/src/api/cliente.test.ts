import { buscarJson, ErroDeApi } from './cliente';

jest.mock('./config', () => ({
  resolverUrlBase: () => 'http://api.teste',
  TEMPO_LIMITE_REQUISICAO_MS: 1000,
}));

const fetchSimulado = jest.fn();

beforeEach(() => {
  fetchSimulado.mockReset();
  globalThis.fetch = fetchSimulado as unknown as typeof fetch;
});

afterEach(() => {
  jest.useRealTimers();
});

const respostaJson = (corpo: unknown, status = 200) =>
  ({ ok: status >= 200 && status < 300, status, json: async () => corpo }) as Response;

describe('buscarJson', () => {
  it('monta a URL ignorando parâmetros indefinidos e devolve o corpo', async () => {
    fetchSimulado.mockResolvedValue(respostaJson([{ id: 1 }]));

    const dados = await buscarJson<{ id: number }[]>('/api/alertas', { limite: 5, tipo: undefined });

    expect(dados).toEqual([{ id: 1 }]);
    expect(fetchSimulado).toHaveBeenCalledWith('http://api.teste/api/alertas?limite=5', expect.anything());
  });

  it('classifica resposta HTTP de erro como falha do servidor', async () => {
    fetchSimulado.mockResolvedValue(respostaJson({}, 500));

    await expect(buscarJson('/api/alertas')).rejects.toMatchObject({
      name: 'ErroDeApi',
      causa: 'servidor',
      status: 500,
    });
  });

  it('classifica falha de conexão como erro de rede', async () => {
    fetchSimulado.mockRejectedValue(new TypeError('Network request failed'));

    const falha = await buscarJson('/api/alertas').catch((erro: unknown) => erro);

    expect(falha).toBeInstanceOf(ErroDeApi);
    expect(falha).toMatchObject({ causa: 'rede' });
  });

  it('aborta a requisição quando o tempo limite é excedido', async () => {
    jest.useFakeTimers();
    fetchSimulado.mockImplementation(
      (_url: string, opcoes: RequestInit) =>
        new Promise((_resolver, rejeitar) => {
          opcoes.signal?.addEventListener('abort', () => rejeitar(new Error('abortado')));
        }),
    );

    const resultado = buscarJson('/api/alertas').catch((erro: unknown) => erro);
    jest.advanceTimersByTime(1000);

    expect(await resultado).toMatchObject({ causa: 'tempo_esgotado' });
  });
});
