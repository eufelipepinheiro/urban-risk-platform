import { useEffect, useState } from 'react';

export function useAgora(intervaloMs: number): number {
  const [agora, setAgora] = useState(Date.now());

  useEffect(() => {
    const temporizador = setInterval(() => setAgora(Date.now()), intervaloMs);
    return () => clearInterval(temporizador);
  }, [intervaloMs]);

  return agora;
}
