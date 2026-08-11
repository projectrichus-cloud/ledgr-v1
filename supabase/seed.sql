-- =============================================================
-- Sample data — optional, purely so the dashboards aren't empty
-- the first time you run this locally. Safe to delete in production.
--
-- NOTE: you must create the two demo users first through Supabase Auth
-- (Studio > Authentication > Add user) using these exact emails, then
-- copy their generated UUIDs into the two variables below before running
-- this file. See README.md, "Loading sample data" for step-by-step help.
-- =============================================================

-- Replace these with the real UUIDs from auth.users after creating the demo accounts:
-- demo CA:          sneha@example.com
-- demo owner:       arjun@example.com

-- insert into companies (id, owner_id, name, gstin, pan, sector, financial_year) values
--   ('00000000-0000-0000-0000-000000000001', '<ARJUN_UUID>', 'Rao Enterprises Pvt Ltd', '29ABCDE1234F1Z5', 'ABCDE1234F', 'Textiles & Manufacturing', '2025-26');

-- insert into ca_clients (ca_id, company_id, status, risk_level) values
--   ('<SNEHA_UUID>', '00000000-0000-0000-0000-000000000001', 'action_needed', 'medium');

-- insert into documents (company_id, type, status, file_name) values
--   ('00000000-0000-0000-0000-000000000001', 'gstr3b', 'completed', 'GSTR_3B_Q3_FY26.pdf'),
--   ('00000000-0000-0000-0000-000000000001', 'bank_statement', 'completed', 'Bank_Statement_Mar2026.pdf'),
--   ('00000000-0000-0000-0000-000000000001', 'form_26as', 'processing', 'Form_26AS_FY26.pdf'),
--   ('00000000-0000-0000-0000-000000000001', 'itr', 'completed', 'ITR_AY25-26.pdf'),
--   ('00000000-0000-0000-0000-000000000001', 'trial_balance', 'missing', null),
--   ('00000000-0000-0000-0000-000000000001', 'ais_tis', 'missing', null);

-- insert into document_requests (company_id, ca_id, document_type, note) values
--   ('00000000-0000-0000-0000-000000000001', '<SNEHA_UUID>', 'trial_balance', 'Needed to complete Q3 reconciliation'),
--   ('00000000-0000-0000-0000-000000000001', '<SNEHA_UUID>', 'ais_tis', 'Required for AIS cross-check');

-- insert into reports (company_id, ca_id, title, status, approved_at) values
--   ('00000000-0000-0000-0000-000000000001', '<SNEHA_UUID>', 'Q3 Reconciliation Report', 'approved', now());
