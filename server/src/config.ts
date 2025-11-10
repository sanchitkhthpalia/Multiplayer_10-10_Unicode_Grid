export const GRID_SIZE = 10;

export const TIMED_RESTRICTION_ENABLED = (process.env.TIMED_RESTRICTION_ENABLED ?? 'true') === 'true';
export const HISTORY_MODE_ENABLED = (process.env.HISTORY_MODE_ENABLED ?? 'true') === 'true';
export const COOLDOWN_MS = Number(process.env.COOLDOWN_MS ?? 60_000);

export const PORT = Number(process.env.PORT ?? 3001);
export const CORS_ORIGIN = process.env.CORS_ORIGIN ?? '*';
