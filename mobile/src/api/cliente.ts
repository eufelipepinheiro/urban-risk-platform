import { resolverUrlBase, TEMPO_LIMITE_REQUISICAO_MS } from './config';

export type CausaDoErro = 'rede' | 'tempo_esgotado' | 'servidor';

export class ErroDeApi extends Error {
  constructor(
    mensagem: string,
    readonly causa: CausaDoErro,
    readonly status?: number,
  ) {
    super(mensagem);
    this.name = 'ErroDeApi';
  }
}

type ParametrosDeConsulta = Record<string, string | number | undefined>;

function montarUrl(caminho: string, parametros: ParametrosDeConsulta): string {
  const consulta = Object.entries(parametros)
    .filter((entrada): entrada is [string, string | number] => entrada[1] !== undefined)
    .map(([chave, valor]) => `${encodeURIComponent(chave)}=${encodeURIComponent(valor)}`)
    .join('&');
  return `${resolverUrlBase()}${caminho}${consulta ? `?${consulta}` : ''}`;
}

export async function buscarJson<T>(
  caminho: string,
  parametros: ParametrosDeConsulta = {},
  sinalExterno?: AbortSignal,
): Promise<T> {
  const controlador = new AbortController();
  let tempoEsgotado = false;
  const temporizador = setTimeout(() => {
    tempoEsgotado = true;
    controlador.abort();
  }, TEMPO_LIMITE_REQUISICAO_MS);
  sinalExterno?.addEventListener('abort', () => controlador.abort());

  try {
    const resposta = await fetch(montarUrl(caminho, parametros), {
      headers: { Accept: 'application/json' },
      signal: controlador.signal,
    });
    if (!resposta.ok) {
      throw new ErroDeApi(`Servidor respondeu ${resposta.status}`, 'servidor', resposta.status);
    }
    return (await resposta.json()) as T;
  } catch (erro) {
    if (erro instanceof ErroDeApi || sinalExterno?.aborted) {
      throw erro;
    }
    throw tempoEsgotado
      ? new ErroDeApi('Tempo de resposta esgotado', 'tempo_esgotado')
      : new ErroDeApi('Sem conexão com o servidor', 'rede');
  } finally {
    clearTimeout(temporizador);
  }
}
