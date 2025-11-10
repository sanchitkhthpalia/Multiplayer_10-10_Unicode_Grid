import { GRID_SIZE, HISTORY_MODE_ENABLED } from './config';

export type Player = {
  id: string;
  lastSubmit: number | null;
};

export type HistoryItem = {
  row: number;
  col: number;
  char: string;
  timestamp: number;
  playerId: string;
};

export const grid: string[][] = Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => ''));
export const players: Map<string, Player> = new Map();
export const history: HistoryItem[] = [];

export function recordHistory(item: HistoryItem) {
  if (!HISTORY_MODE_ENABLED) return;
  history.push(item);
}
