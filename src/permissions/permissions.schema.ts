import { z } from 'zod';

export const CreationPermissionSchema = z.enum([
  'Customer',
  'Deal',
  'BankAccount',
  'Terminal',
  'eTerminal',
  'DebitCard',
  'PrepaidCard',
  'User',
]);

export const ProductPermissionSchema = z.enum([
  'READ',
  'UPDATE',
  'DELETE',
  'BALANCE',
  'TRANSACTIONS',
  'DEBIT',
  'CREDIT',
  'ENABLE',
  'CONFIG',
]);

export const CustomerPermissionSchema = z.enum([
  'READ',
  'UPDATE',
  'DELETE',
  'KYC',
  'ISSUE_DEBIT_CARD',
  'ISSUE_PREPAID_CARD',
  'ENABLE',
  'CONFIG',
  'DEAL',
]);

export const UserPermissionSchema = z.enum([
  'READ',
  'UPDATE_INFO',
  'ENABLE',
  'DELETE',
  'UPDATE_PERMISSIONS',
]);

export const PermissionToCreateSchema = z.object({
  subsystem_id: z.string().min(1).max(64),
  permission: z.array(CreationPermissionSchema).min(1),
});

export const PermissionOnBankAccountSchema = z.object({
  bank_account_id: z.string().uuid(),
  subsystem_id: z.string().min(1).max(64),
  permission: z.array(ProductPermissionSchema).min(1),
  customer_id: z.string().uuid(),
});

export const PermissionOnCustomerSchema = z.object({
  subsystem_id: z.string().min(1).max(64),
  permission: z.array(CustomerPermissionSchema).min(1),
  customer_id: z.string().uuid(),
});

export const PermissionOnUserSchema = z.object({
  subsystem_id: z.string().min(1).max(64),
  permission: z.array(UserPermissionSchema).min(1),
});

export const PermissionsBodySchema = z.object({
  permissions_to_create: z.array(PermissionToCreateSchema).default([]),
  permissions_on_bank_account: z.array(PermissionOnBankAccountSchema).default([]),
  permissions_on_customer: z.array(PermissionOnCustomerSchema).default([]),
  permissions_on_user: z.array(PermissionOnUserSchema).default([]),
});

export type PermissionsBody = z.infer<typeof PermissionsBodySchema>;
export type PermissionToCreate = z.infer<typeof PermissionToCreateSchema>;
export type PermissionOnBankAccount = z.infer<typeof PermissionOnBankAccountSchema>;
export type PermissionOnCustomer = z.infer<typeof PermissionOnCustomerSchema>;
export type PermissionOnUser = z.infer<typeof PermissionOnUserSchema>;
