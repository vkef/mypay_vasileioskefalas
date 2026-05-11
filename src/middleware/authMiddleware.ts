import { NextFunction, Request, Response } from 'express';

export function requireApiKey(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const expectedApiKey = process.env.API_KEY;
  const apiKey = req.header('x-api-key');

  if (!expectedApiKey || apiKey !== expectedApiKey) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}
