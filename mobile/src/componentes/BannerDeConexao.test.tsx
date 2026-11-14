import { fireEvent, render, screen } from '@testing-library/react-native';
import type { StatusDaConexao } from '../hooks/useStatusDaConexao';
import { BannerDeConexao } from './BannerDeConexao';

const ULTIMA_ATUALIZACAO = new Date(2026, 10, 9, 14, 32, 5).getTime();

function criarStatus(parcial: Partial<StatusDaConexao> = {}): StatusDaConexao {
  return { estado: 'desconectado', causa: 'rede', ultimaAtualizacao: ULTIMA_ATUALIZACAO, tentarAgora: jest.fn(), ...parcial };
}

describe('BannerDeConexao', () => {
  it('não renderiza nada enquanto a conexão está normal', async () => {
    await render(<BannerDeConexao {...criarStatus({ estado: 'conectado' })} />);

    expect(screen.toJSON()).toBeNull();
  });

  it('informa a desconexão e o horário dos dados exibidos', async () => {
    await render(<BannerDeConexao {...criarStatus()} />);

    expect(screen.getByText('Sem conexão com o servidor')).toBeTruthy();
    expect(screen.getByText('Mostrando dados de 14:32:05. Tentando reconectar…')).toBeTruthy();
  });

  it('distingue falha do servidor de falta de conexão', async () => {
    await render(<BannerDeConexao {...criarStatus({ causa: 'servidor' })} />);

    expect(screen.getByText('Servidor com problemas')).toBeTruthy();
  });

  it('permite tentar reconectar manualmente', async () => {
    const tentarAgora = jest.fn();
    await render(<BannerDeConexao {...criarStatus({ tentarAgora })} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Tentar reconectar agora' }));

    expect(tentarAgora).toHaveBeenCalledTimes(1);
  });

  it('confirma a reconexão sem oferecer botão', async () => {
    await render(<BannerDeConexao {...criarStatus({ estado: 'reconectado' })} />);

    expect(screen.getByText('Conexão restabelecida')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
