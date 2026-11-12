import { fireEvent, render, screen } from '@testing-library/react-native';
import { criarAlerta } from '../testes/fabricas';
import { CartaoDeAlerta } from './CartaoDeAlerta';

const AGORA = Date.parse('2026-11-09T12:02:01Z');

describe('CartaoDeAlerta', () => {
  it('descreve o alerta completo para leitores de tela', async () => {
    await render(<CartaoDeAlerta alerta={criarAlerta()} agora={AGORA} aoPressionar={jest.fn()} />);

    const cartao = screen.getByRole('button');

    expect(cartao.props.accessibilityLabel).toContain('Alagamento, prioridade alta, 85 pontos.');
    expect(cartao.props.accessibilityLabel).toContain('Fonte: Sensor, SIM-ALAGAMENTO-01, confiança alta.');
    expect(cartao.props.accessibilityLabel).toContain('há 2 min.');
  });

  it('informa o id do evento ao ser pressionado', async () => {
    const aoPressionar = jest.fn();
    await render(
      <CartaoDeAlerta alerta={criarAlerta({}, { id: 42 })} agora={AGORA} aoPressionar={aoPressionar} />,
    );

    await fireEvent.press(screen.getByRole('button'));

    expect(aoPressionar).toHaveBeenCalledWith(42);
  });

  it('mostra texto alternativo quando o evento não tem descrição', async () => {
    await render(
      <CartaoDeAlerta alerta={criarAlerta({}, { descricao: null })} agora={AGORA} aoPressionar={jest.fn()} />,
    );

    expect(screen.getByText('Sem descrição')).toBeTruthy();
  });
});
