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
