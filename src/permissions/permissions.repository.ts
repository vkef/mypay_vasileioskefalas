import { PoolClient } from 'pg';
import pool from '../db/pool';
import { PermissionsBody } from './permissions.schema';

export interface UserPermissions {
  permissions_to_create: unknown[];
  permissions_on_bank_account: unknown[];
  permissions_on_customer: unknown[];
  permissions_on_user: unknown[];
}

export async function fetchPermissions(userId: string): Promise<UserPermissions> {
  const client: PoolClient = await pool.connect();

  try {
    const toCreate = await client.query(
      `SELECT subsystem_id, permission
       FROM public.permissions_to_create
       WHERE user_account_id = $1`,
      [userId]
    );

    const onBankAccount = await client.query(
      `SELECT bank_account_id, subsystem_id, permission, customer_id
       FROM public.permissions_on_bank_account
       WHERE user_account_id = $1`,
      [userId]
    );

    const onCustomer = await client.query(
      `SELECT subsystem_id, permission, customer_id
       FROM public.permissions_on_customer
       WHERE user_account_id = $1`,
      [userId]
    );

    const onUser = await client.query(
      `SELECT subsystem_id, permission
       FROM public.permissions_on_user
       WHERE user_account_id = $1`,
      [userId]
    );

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

export async function replacePermissions(
  userId: string,
  body: PermissionsBody
): Promise<void> {
  const client: PoolClient = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `DELETE FROM public.permissions_to_create
       WHERE user_account_id = $1`,
      [userId]
    );
    await client.query(
      `DELETE FROM public.permissions_on_bank_account
       WHERE user_account_id = $1`,
      [userId]
    );
    await client.query(
      `DELETE FROM public.permissions_on_customer
       WHERE user_account_id = $1`,
      [userId]
    );
    await client.query(
      `DELETE FROM public.permissions_on_user
       WHERE user_account_id = $1`,
      [userId]
    );

    for (const row of body.permissions_to_create) {
      await client.query(
        `INSERT INTO public.permissions_to_create
         (subsystem_id, user_account_id, permission)
         VALUES ($1, $2, $3::"CreationPermission"[])`,
        [row.subsystem_id, userId, row.permission]
      );
    }

    for (const row of body.permissions_on_bank_account) {
      await client.query(
        `INSERT INTO public.permissions_on_bank_account
         (subsystem_id, user_account_id, customer_id, permission, bank_account_id)
         VALUES ($1, $2, $3, $4::"ProductPermission"[], $5)`,
        [row.subsystem_id, userId, row.customer_id, row.permission, row.bank_account_id]
      );
    }

    for (const row of body.permissions_on_customer) {
      await client.query(
        `INSERT INTO public.permissions_on_customer
         (subsystem_id, user_account_id, customer_id, permission)
         VALUES ($1, $2, $3, $4::"CustomerPermission"[])`,
        [row.subsystem_id, userId, row.customer_id, row.permission]
      );
    }

    for (const row of body.permissions_on_user) {
      await client.query(
        `INSERT INTO public.permissions_on_user
         (subsystem_id, user_account_id, permission)
         VALUES ($1, $2, $3::"UserPermission"[])`,
        [row.subsystem_id, userId, row.permission]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
