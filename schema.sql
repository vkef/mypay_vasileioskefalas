CREATE DOMAIN public."MnemonicId"
AS character varying(64)
NOT NULL;

CREATE TYPE public."CreationPermission" AS ENUM (
  'Customer', 'Deal', 'BankAccount', 'Terminal', 'eTerminal',
  'DebitCard', 'PrepaidCard', 'User'
);

CREATE TYPE public."CustomerPermission" AS ENUM (
  'READ', 'UPDATE', 'DELETE', 'KYC', 'ISSUE_DEBIT_CARD',
  'ISSUE_PREPAID_CARD', 'ENABLE', 'CONFIG', 'DEAL'
);

CREATE TYPE public."ProductPermission" AS ENUM (
  'READ', 'UPDATE', 'DELETE', 'BALANCE', 'TRANSACTIONS', 'DEBIT',
  'CREDIT', 'ENABLE', 'CONFIG'
);

CREATE TYPE public."UserPermission" AS ENUM (
  'READ', 'UPDATE_INFO', 'ENABLE', 'DELETE', 'UPDATE_PERMISSIONS'
);

CREATE TABLE IF NOT EXISTS public.user_account
(
  id "MnemonicId" COLLATE pg_catalog."default" NOT NULL,
  active boolean NOT NULL DEFAULT false,
  first_name text COLLATE pg_catalog."default" NOT NULL,
  last_name text COLLATE pg_catalog."default" NOT NULL,
  email text COLLATE pg_catalog."default" NOT NULL,
  CONSTRAINT user_account_pkey PRIMARY KEY (id),
  CONSTRAINT user_account_email_key UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public.subsystem
(
  id "MnemonicId" COLLATE pg_catalog."default" NOT NULL,
  active boolean NOT NULL DEFAULT false,
  CONSTRAINT subsystem_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.permissions_to_create
(
  subsystem_id "MnemonicId" COLLATE pg_catalog."default" NOT NULL,
  user_account_id "MnemonicId" COLLATE pg_catalog."default" NOT NULL,
  permission "CreationPermission"[] NOT NULL,
  CONSTRAINT permission_to_create_pkey PRIMARY KEY (subsystem_id, user_account_id),
  CONSTRAINT permission_to_create_subsystem_id_fkey FOREIGN KEY (subsystem_id)
    REFERENCES public.subsystem (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
  CONSTRAINT permission_to_create_user_account_id_fkey FOREIGN KEY (user_account_id)
    REFERENCES public.user_account (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.permissions_on_bank_account
(
  subsystem_id "MnemonicId" COLLATE pg_catalog."default" NOT NULL,
  user_account_id "MnemonicId" COLLATE pg_catalog."default" NOT NULL,
  customer_id uuid NOT NULL,
  permission "ProductPermission"[] NOT NULL,
  bank_account_id uuid NOT NULL,
  CONSTRAINT permissions_on_bank_account_pkey
    PRIMARY KEY (subsystem_id, user_account_id, customer_id, bank_account_id),
  CONSTRAINT permissions_on_bank_accounts_subsystem_id_fkey FOREIGN KEY (subsystem_id)
    REFERENCES public.subsystem (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
  CONSTRAINT permissions_on_bank_accounts_user_account_id_fkey FOREIGN KEY (user_account_id)
    REFERENCES public.user_account (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.permissions_on_customer
(
  subsystem_id "MnemonicId" COLLATE pg_catalog."default" NOT NULL,
  user_account_id "MnemonicId" COLLATE pg_catalog."default" NOT NULL,
  customer_id uuid NOT NULL,
  permission "CustomerPermission"[] NOT NULL,
  CONSTRAINT customer_permission_pkey PRIMARY KEY (subsystem_id, user_account_id, customer_id),
  CONSTRAINT customer_permissions_subsystem_id_fkey FOREIGN KEY (subsystem_id)
    REFERENCES public.subsystem (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
  CONSTRAINT customer_permissions_user_account_id_fkey FOREIGN KEY (user_account_id)
    REFERENCES public.user_account (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.permissions_on_user
(
  subsystem_id "MnemonicId" COLLATE pg_catalog."default" NOT NULL,
  user_account_id "MnemonicId" COLLATE pg_catalog."default" NOT NULL,
  permission "UserPermission"[] NOT NULL,
  CONSTRAINT permissions_on_user_pkey PRIMARY KEY (subsystem_id, user_account_id),
  CONSTRAINT permissions_on_user_subsystem_id_fkey FOREIGN KEY (subsystem_id)
    REFERENCES public.subsystem (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
  CONSTRAINT permissions_on_user_user_account_id_fkey FOREIGN KEY (user_account_id)
    REFERENCES public.user_account (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);
