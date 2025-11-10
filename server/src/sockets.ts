import { Server } from 'socket.io';
import { grid, players, recordHistory } from './state';
import { COOLDOWN_MS, TIMED_RESTRICTION_ENABLED } from './config';
import type { Socket } from 'socket.io';

function isSingleGrapheme(s: string): string {
  // Accept first Unicode character (user may paste multi). Keep minimal: take first code point.
  if (!s) return '';
  const iter = s[Symbol.iterator]();
  const first = iter.next().value ?? '';
  return first;
}

export function setupSockets(io: Server) {
  io.on('connection', (socket: Socket) => {
    // Debug: connection established
    // eslint-disable-next-line no-console
    console.log('[io] connection', socket.id);
    players.set(socket.id, { id: socket.id, lastSubmit: null });
    io.emit('player_count', players.size);

    // Allow client to request the current player count (handles race conditions)
    socket.on('get_player_count', (ack?: (n: number) => void) => {
      ack?.(players.size);
    });

    socket.on('submit', (payload: { row: number; col: number; char: string }, ack?: (resp: { ok: boolean; error?: string }) => void) => {
      const { row, col } = payload ?? {} as any;
      let { char } = payload ?? {} as any;

      if (
        typeof row !== 'number' ||
        typeof col !== 'number' ||
        row < 0 || col < 0 ||
        row >= grid.length || col >= grid[0].length
      ) {
        ack?.({ ok: false, error: 'Invalid cell coordinates' });
        return;
      }

      char = isSingleGrapheme(String(char ?? '')).trim();
      if (!char) {
        ack?.({ ok: false, error: 'Character required' });
        return;
      }

      const player = players.get(socket.id);
      if (!player) {
        ack?.({ ok: false, error: 'Player not found' });
        return;
      }

      const now = Date.now();

      if (!TIMED_RESTRICTION_ENABLED) {
        if (player.lastSubmit !== null) {
          ack?.({ ok: false, error: 'You have already submitted once' });
          return;
        }
      } else {
        if (player.lastSubmit !== null && now - player.lastSubmit < COOLDOWN_MS) {
          const remain = COOLDOWN_MS - (now - player.lastSubmit);
          ack?.({ ok: false, error: `Cooldown active. Wait ${Math.ceil(remain / 1000)}s` });
          return;
        }
      }

      // Debug: valid submit
      // eslint-disable-next-line no-console
      console.log('[io] submit', { socket: socket.id, row, col, char });
      grid[row][col] = char;
      player.lastSubmit = now;

      recordHistory({ row, col, char, timestamp: now, playerId: socket.id });

      io.emit('grid_update', { row, col, char, playerCount: players.size });
      ack?.({ ok: true });
    });

    socket.on('disconnect', () => {
      // Debug: disconnection
      // eslint-disable-next-line no-console
      console.log('[io] disconnect', socket.id);
      players.delete(socket.id);
      io.emit('player_count', players.size);
    });
  });
}
