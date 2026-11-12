import Constants from 'expo-constants';
import { Platform } from 'react-native';

const PORTA_DO_BACKEND = 8080;

export const INTERVALO_DE_ATUALIZACAO_MS = 5000;
export const TEMPO_LIMITE_REQUISICAO_MS = 8000;

// Em desenvolvimento o Expo informa o IP da máquina que serve o app; o backend roda nela, na porta 8080.
export function resolverUrlBase(): string {
  const urlConfigurada = process.env.EXPO_PUBLIC_API_URL;
  if (urlConfigurada) {
    return urlConfigurada.replace(/\/$/, '');
  }

  const hostDoServidorDeDesenvolvimento = Constants.expoConfig?.hostUri?.split(':')[0];
  if (hostDoServidorDeDesenvolvimento) {
    return `http://${hostDoServidorDeDesenvolvimento}:${PORTA_DO_BACKEND}`;
  }

  const hostPadrao = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${hostPadrao}:${PORTA_DO_BACKEND}`;
}
