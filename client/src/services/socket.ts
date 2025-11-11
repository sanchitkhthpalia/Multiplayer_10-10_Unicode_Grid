import { io, Socket } from 'socket.io-client';

const url = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export type ServerToClientEvents = {
  player_count: (n: number) => void;
  grid_update: (payload: { row: number; col: number; char: string; playerCount: number }) => void;
};

export type ClientToServerEvents = {
  submit: (payload: { row: number; col: number; char: string }, ack?: (resp: { ok: boolean; error?: string }) => void) => void;
  get_player_count: (ack?: (n: number) => void) => void;
};

// Debug: show which URL we are connecting to
// eslint-disable-next-line no-console
console.log('[socket] creating client', { url });

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(url, {
  transports: ['polling'],
  autoConnect: true,
  reconnection: true,
  path: '/socket.io',
});

// Debug hooks
socket.on('connect', () => console.log('[socket] connect', socket.id));
socket.on('connect_error', (e) => console.error('[socket] connect_error', e));
socket.on('disconnect', (r) => console.warn('[socket] disconnect', r));
