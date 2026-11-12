const MS_POR_SEGUNDO = 1000;
const MS_POR_MINUTO = 60 * MS_POR_SEGUNDO;
const MS_POR_HORA = 60 * MS_POR_MINUTO;
const MS_POR_DIA = 24 * MS_POR_HORA;
const LIMITE_PARA_AGORA_MS = 10 * MS_POR_SEGUNDO;

// O backend envia frações de segundo com até 9 dígitos; a especificação de Date só garante 3.
export function analisarInstante(iso: string): number {
  return Date.parse(iso.replace(/(\.\d{3})\d+/, '$1'));
}

export function descreverTempoDecorrido(iso: string, agora: number = Date.now()): string {
  const decorrido = Math.max(0, agora - analisarInstante(iso));

  if (decorrido < LIMITE_PARA_AGORA_MS) return 'agora';
  if (decorrido < MS_POR_MINUTO) return `há ${Math.floor(decorrido / MS_POR_SEGUNDO)} s`;
  if (decorrido < MS_POR_HORA) return `há ${Math.floor(decorrido / MS_POR_MINUTO)} min`;
  if (decorrido < MS_POR_DIA) return `há ${Math.floor(decorrido / MS_POR_HORA)} h`;
  return `há ${Math.floor(decorrido / MS_POR_DIA)} d`;
}

const doisDigitos = (numero: number) => String(numero).padStart(2, '0');

export function formatarHorario(instante: number): string {
  const data = new Date(instante);
  return `${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}:${doisDigitos(data.getSeconds())}`;
}

export function formatarDataHora(iso: string): string {
  const instante = analisarInstante(iso);
  const data = new Date(instante);
  const dia = `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}/${data.getFullYear()}`;
  return `${dia} ${formatarHorario(instante)}`;
}
