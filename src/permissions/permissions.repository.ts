import { PoolClient } from 'pg';
import pool from '../db/pool';

export interface UserPermissions {
  permissions_to_create: unknown[];
  permissions_on_bank_account: unknown[];
  permissions_on_customer: unknown[];
  permissions_on_user: unknown[];
}

export async function fetchPermissions(userId: string): Promise<UserPermissions> {
  const client: PoolClient = await pool.connect();

  try {
    const [toCreate, onBankAccount, onCustomer, onUser] = await Promise.all([
      client.query(
        `SELECT subsystem_id, permission
         FROM public.permissions_to_create
         WHERE user_account_id = $1`,
        [userId]
      ),
      client.query(
        `SELECT bank_account_id, subsystem_id, permission, customer_id
         FROM public.permissions_on_bank_account
         WHERE user_account_id = $1`,
        [userId]
      ),
      client.query(
        `SELECT subsystem_id, permission, customer_id
         FROM public.permissions_on_customer
         WHERE user_account_id = $1`,
        [userId]
      ),
      client.query(
        `SELECT subsystem_id, permission
         FROM public.permissions_on_user
         WHERE user_account_id = $1`,
        [userId]
      ),
    ]);

    return {
      permissions_to_create: toCreate.rows,
      permissions_on_bank_account: onBankAccount.rows,
      permissions_on_customer: onCustomer.rows,
      permissions_on_user: onUser.rows,
    };
  } finally {
    client.release();
  }
}
