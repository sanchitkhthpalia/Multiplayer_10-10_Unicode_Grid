import React, { useEffect, useState } from 'react';
import { fetchHistory, HistoryItem } from '../services/api';

export default function History() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [enabled, setEnabled] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    fetchHistory().then((res) => {
      if (!mounted) return;
      setEnabled(res.enabled);
      setItems(res.history);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!enabled) return <div>History disabled by server config.</div>;

  return (
    <div>
      <h3>History</h3>
      <div style={{ maxHeight: 200, overflow: 'auto', border: '1px solid #eee', padding: 8 }}>
        {items.length === 0 && <div>No history yet.</div>}
        {items.map((h, idx) => (
          <div key={idx} style={{ fontFamily: 'monospace', fontSize: 12 }}>
            [{new Date(h.timestamp).toLocaleTimeString()}] ({h.row},{h.col}) '{h.char}' by {h.playerId}
          </div>
        ))}
      </div>
    </div>
  );
}
