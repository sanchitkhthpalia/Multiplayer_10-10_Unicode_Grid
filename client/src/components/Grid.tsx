import React from 'react';

type Props = {
  grid: string[][];
  selected: { row: number; col: number } | null;
  onSelect: (row: number, col: number) => void;
};

export default function Grid({ grid, selected, onSelect }: Props) {
  return (
    <div className="grid">
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const isSel = selected && selected.row === r && selected.col === c;
          return (
            <button
              key={`${r}-${c}`}
              onClick={() => onSelect(r, c)}
              className={`cell${isSel ? ' selected' : ''}`}
              title={`r${r} c${c}`}
            >
              {cell}
            </button>
          );
        })
      )}
    </div>
  );
}
