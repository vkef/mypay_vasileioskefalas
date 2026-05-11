import { NextFunction, Request, Response } from 'express';
import { PermissionsBodySchema } from './permissions.schema';
import { getUserPermissions, replaceUserPermissions } from './permissions.service';

// GET 
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

// PUT 
export async function updatePermissionsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { user_id } = req.params;
    const parsed = PermissionsBodySchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: 'Invalid request body',
      });
      return;
    }

    const permissions = await replaceUserPermissions(user_id, parsed.data);
    res.status(200).json(permissions);
  } catch (err) {
    next(err);
  }
}
