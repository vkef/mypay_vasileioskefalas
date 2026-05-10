import { NextFunction, Request, Response } from 'express';
import { getUserPermissions } from './permissions.service';

export async function getPermissionsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { user_id } = req.params;
    const permissions = await getUserPermissions(user_id);

    res.status(200).json(permissions);
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
