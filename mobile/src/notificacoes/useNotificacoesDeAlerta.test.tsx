import { renderHook } from '@testing-library/react-native';
import type { Alerta } from '../api/tipos';
import { useAlertas } from '../hooks/useAlertas';
import { criarAlerta } from '../testes/fabricas';
import { notificarNovosAlertas } from './servico';
import { useNotificacoesDeAlerta } from './useNotificacoesDeAlerta';

jest.mock('../hooks/useAlertas');
jest.mock('./servico');

const useAlertasSimulado = jest.mocked(useAlertas);
const notificarSimulado = jest.mocked(notificarNovosAlertas);

const alta = (id: number) => criarAlerta({ prioridade: 'ALTA' }, { id });
const media = (id: number) => criarAlerta({ prioridade: 'MEDIA' }, { id });

function simularDados(alertas: Alerta[]) {
  useAlertasSimulado.mockReturnValue({ data: alertas } as unknown as ReturnType<typeof useAlertas>);
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useNotificacoesDeAlerta', () => {
  it('não notifica os alertas que já existiam na primeira carga', async () => {
    simularDados([alta(1), alta(2)]);

    await renderHook(() => useNotificacoesDeAlerta());

    expect(notificarSimulado).not.toHaveBeenCalled();
  });

  it('notifica uma única vez cada novo alerta de prioridade alta', async () => {
    simularDados([alta(1)]);
    const { rerender } = await renderHook(() => useNotificacoesDeAlerta());

    simularDados([alta(1), alta(2)]);
    await rerender(undefined);
    simularDados([alta(1), alta(2), media(3)]);
    await rerender(undefined);

    expect(notificarSimulado).toHaveBeenCalledTimes(1);
    expect(notificarSimulado.mock.calls[0][0].map((alerta) => alerta.evento.id)).toEqual([2]);
  });

  it('notifica um alerta existente que passou a ter prioridade alta', async () => {
    simularDados([media(5)]);
    const { rerender } = await renderHook(() => useNotificacoesDeAlerta());

    simularDados([alta(5)]);
    await rerender(undefined);

    expect(notificarSimulado).toHaveBeenCalledTimes(1);
  });

  it('agrupa em uma única notificação os alertas retidos pelo intervalo mínimo', async () => {
    const relogio = jest.spyOn(Date, 'now').mockReturnValue(1_000_000);
    simularDados([alta(1)]);
    const { rerender } = await renderHook(() => useNotificacoesDeAlerta());

    simularDados([alta(1), alta(2)]);
    await rerender(undefined);
    relogio.mockReturnValue(1_010_000);
    simularDados([alta(1), alta(2), alta(3)]);
    await rerender(undefined);
    expect(notificarSimulado).toHaveBeenCalledTimes(1);

    relogio.mockReturnValue(1_040_000);
    simularDados([alta(1), alta(2), alta(3), alta(4)]);
    await rerender(undefined);

    expect(notificarSimulado).toHaveBeenCalledTimes(2);
    expect(notificarSimulado.mock.calls[1][0].map((alerta) => alerta.evento.id)).toEqual([3, 4]);
    relogio.mockRestore();
  });
});
