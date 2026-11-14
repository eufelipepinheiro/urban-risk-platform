import * as Notifications from 'expo-notifications';
import { criarAlerta } from '../testes/fabricas';
import { notificarNovosAlertas, ouvirToquesEmNotificacoes, prepararNotificacoes } from './servico';

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  AndroidImportance: { MAX: 5 },
  PermissionStatus: { DENIED: 'denied', GRANTED: 'granted', UNDETERMINED: 'undetermined' },
}));

const notificacoes = jest.mocked(Notifications);
const permissao = (granted: boolean) => ({ granted, status: granted ? 'granted' : 'undetermined' }) as never;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('prepararNotificacoes', () => {
  it('não pede permissão novamente quando já foi concedida', async () => {
    notificacoes.getPermissionsAsync.mockResolvedValue(permissao(true));

    await expect(prepararNotificacoes()).resolves.toBe(true);
    expect(notificacoes.requestPermissionsAsync).not.toHaveBeenCalled();
  });

  it('solicita a permissão quando ainda não foi concedida', async () => {
    notificacoes.getPermissionsAsync.mockResolvedValue(permissao(false));
    notificacoes.requestPermissionsAsync.mockResolvedValue(permissao(true));

    await expect(prepararNotificacoes()).resolves.toBe(true);
    expect(notificacoes.requestPermissionsAsync).toHaveBeenCalledTimes(1);
  });
});

describe('notificarNovosAlertas', () => {
  it('agenda a notificação imediatamente, levando o id do evento', async () => {
    await notificarNovosAlertas([criarAlerta({}, { id: 7 })]);

    expect(notificacoes.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: expect.objectContaining({
        title: 'Alerta de prioridade alta: Alagamento',
        data: { eventoId: 7 },
      }),
      trigger: { channelId: 'alertas-de-risco' },
    });
  });
});

describe('ouvirToquesEmNotificacoes', () => {
  function capturarOuvinte() {
    let ouvinte: (resposta: never) => void = () => undefined;
    notificacoes.addNotificationResponseReceivedListener.mockImplementation(((registrado: typeof ouvinte) => {
      ouvinte = registrado;
      return { remove: jest.fn() };
    }) as never);
    return (dados: Record<string, unknown>) =>
      ouvinte({ notification: { request: { content: { data: dados } } } } as never);
  }

  it('abre o alerta quando a notificação carrega um id de evento', () => {
    const tocar = capturarOuvinte();
    const aoAbrirAlerta = jest.fn();
    ouvirToquesEmNotificacoes(aoAbrirAlerta);

    tocar({ eventoId: 7 });

    expect(aoAbrirAlerta).toHaveBeenCalledWith(7);
  });

  it('ignora notificações sem id de evento', () => {
    const tocar = capturarOuvinte();
    const aoAbrirAlerta = jest.fn();
    ouvirToquesEmNotificacoes(aoAbrirAlerta);

    tocar({});

    expect(aoAbrirAlerta).not.toHaveBeenCalled();
  });
});
