import pool from '../db/pool';
import { fetchPermissions, UserPermissions } from './permissions.repository';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

async function assertUserExists(userId: string): Promise<void> {
  const result = await pool.query(
    `SELECT id
     FROM public.user_account
     WHERE id = $1`,
    [userId]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError(`User '${userId}' not found`);
  }
}

export async function getUserPermissions(userId: string): Promise<UserPermissions> {
  await assertUserExists(userId);
  return fetchPermissions(userId);
}
