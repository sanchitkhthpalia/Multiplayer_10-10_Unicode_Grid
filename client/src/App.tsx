import React, { useEffect, useMemo, useState } from 'react';
import Grid from './components/Grid';
import PlayerCount from './components/PlayerCount';
import History from './components/History';
import { fetchGrid } from './services/api';
import { createSocket } from './services/socket';

export default function App() {
  const socket = useMemo(() => createSocket(), []);
  const [grid, setGrid] = useState<string[][]>(Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => '')));
  const [playerCount, setPlayerCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGrid().then(setGrid).catch(() => setError('Failed to load grid'));
  }, []);

  useEffect(() => {
    // Connection status and debug logs
    socket.on('connect', () => {
      setConnected(true);
      // eslint-disable-next-line no-console
      console.log('[socket] connected', socket.id);
      // Request latest player count in case initial broadcast was missed
      socket.emit('get_player_count', (n?: number) => {
        if (typeof n === 'number') setPlayerCount(n);
      });
    });
    socket.on('disconnect', (reason: string) => {
      setConnected(false);
      // eslint-disable-next-line no-console
      console.warn('[socket] disconnected:', reason);
    });
    socket.io.on('error', (err: any) => {
      // eslint-disable-next-line no-console
      console.error('[socket] error', err);
    });
    socket.io.on('reconnect_attempt', () => {
      // eslint-disable-next-line no-console
      console.log('[socket] reconnecting...');
    });

    socket.on('player_count', (n: number) => setPlayerCount(n));
    socket.on('grid_update', ({ row, col, char, playerCount }: { row: number; col: number; char: string; playerCount: number }) => {
      setGrid((g) => {
        const next = g.map((r) => r.slice());
        next[row][col] = char;
        return next;
      });
      setPlayerCount(playerCount);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  async function submit() {
    setError(null);
    if (!selected) {
      setError('Select a cell first');
      return;
    }
    const char = input.trim();
    if (!char) {
      setError('Enter a Unicode character');
      return;
    }
    if (!connected) {
      setError('Not connected to server');
      return;
    }
    socket.emit('submit', { row: selected.row, col: selected.col, char }, (resp: { ok: boolean; error?: string }) => {
      if (!resp.ok) setError(resp.error || 'Submit failed');
      else setInput('');
    });
  }

  return (
    <div className="app">
      <div className="header">
        <div className="title">Multiplayer Unicode Grid</div>
        <PlayerCount count={playerCount} />
      </div>

      <div className="layout">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Grid</div>
            {selected && <div className="badge"><span className="badge-dot online" />Selected: ({selected.row},{selected.col})</div>}
          </div>
          <Grid grid={grid} selected={selected} onSelect={(r, c) => setSelected({ row: r, col: c })} />
          <div className="controls">
            <input
              className="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a character"
              maxLength={4}
            />
            <button className="button primary" onClick={submit} disabled={!connected}>Submit</button>
          </div>
          {error && <div className="error">{error}</div>}
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">History</div>
          </div>
          <History />
        </div>
      </div>

      <div className="tip">Tip: Paste any Unicode symbol (emoji, CJK, etc.). Only the first character will be used.</div>
    </div>
  );
}
