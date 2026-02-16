
export type BingoNumber = number;

export interface BingoTicket {
  id: string;
  grid: (number | null)[][]; // 3 rows x 9 columns
  marked: boolean[][];
}

export interface GameState {
  drawnNumbers: number[];
  currentNumber: number | null;
  history: number[];
  isPlaying: boolean;
  isCalling: boolean;
  gameStatus: 'ready' | 'playing' | 'paused' | 'finished';
  bingoLingo: string;
}

export enum WinType {
  NONE = 'NONE',
  LINE = 'LINE',
  FULL_HOUSE = 'FULL_HOUSE'
}
