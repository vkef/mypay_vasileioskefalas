import { NextFunction, Request, Response } from 'express';

export async function getPermissionsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { user_id } = req.params;

    res.status(501).json({
      error: 'Permission retrieval is not implemented yet',
      user_id,
    });
  } catch (err) {
    next(err);
  }
}

export async function updatePermissionsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { user_id } = req.params;

    res.status(501).json({
      error: 'Permission update is not implemented yet',
      user_id,
    });
  } catch (err) {
    next(err);
  }
}
