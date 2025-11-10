import React from 'react';

type Props = { count: number };

export default function PlayerCount({ count }: Props) {
  return <div style={{ fontWeight: 600 }}>Online players: {count}</div>;
}
