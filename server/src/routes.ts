import { Router, type Request, type Response } from 'express';
import { grid, history } from './state';
import { HISTORY_MODE_ENABLED } from './config';

export const router = Router();

router.get('/grid', (_req: Request, res: Response) => {
  res.json({ grid });
});

router.get('/history', (_req: Request, res: Response) => {
  if (!HISTORY_MODE_ENABLED) {
    res.json({ enabled: false, history: [] });
    return;
  }
  res.json({ enabled: true, history });
});
