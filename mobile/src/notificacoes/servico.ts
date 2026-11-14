import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Alerta } from '../api/tipos';
import { montarNotificacao } from './selecao';

const CANAL_DE_ALERTAS = 'alertas-de-risco';

export async function prepararNotificacoes(): Promise<boolean> {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CANAL_DE_ALERTAS, {
      name: 'Alertas de risco',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const atual = await Notifications.getPermissionsAsync();
  const permissao = atual.granted ? atual : await Notifications.requestPermissionsAsync();
  return permissao.granted;
}

export async function permissaoDeNotificacaoNegada(): Promise<boolean> {
  const permissao = await Notifications.getPermissionsAsync();
  return permissao.status === Notifications.PermissionStatus.DENIED;
}

export async function notificarNovosAlertas(novos: Alerta[]): Promise<void> {
  const conteudo = montarNotificacao(novos);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: conteudo.titulo,
      body: conteudo.corpo,
      data: conteudo.eventoId === undefined ? {} : { eventoId: conteudo.eventoId },
    },
    trigger: { channelId: CANAL_DE_ALERTAS },
  });
}

export function ouvirToquesEmNotificacoes(aoAbrirAlerta: (eventoId: number) => void): () => void {
  const assinatura = Notifications.addNotificationResponseReceivedListener((resposta) => {
    const eventoId = resposta.notification.request.content.data?.eventoId;
    if (typeof eventoId === 'number') {
      aoAbrirAlerta(eventoId);
    }
  });
  return () => assinatura.remove();
}
