import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = axios.create({ baseURL });

export type GridResponse = { grid: string[][] };
export type HistoryItem = { row: number; col: number; char: string; timestamp: number; playerId: string };
export type HistoryResponse = { enabled: boolean; history: HistoryItem[] };

export async function fetchGrid() {
  const { data } = await api.get<GridResponse>('/grid');
  return data.grid;
}

export async function fetchHistory() {
  const { data } = await api.get<HistoryResponse>('/history');
  return data;
}
