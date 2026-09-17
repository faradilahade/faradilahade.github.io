-- ============================================================
-- OPTIONAL: create the admin sign-in user with SQL instead of the dashboard.
-- Run in Supabase → SQL Editor. Safe to re-run (does nothing if the user exists).
--
-- The site's admin page accepts a USERNAME. It is mapped to an email like
--   <username>@faradilahade.github.io      (domain: src/lib/site.ts → adminEmailDomain)
-- so the username "admin-fara" signs in as admin-fara@faradilahade.github.io.
--
-- 1) Replace CHANGE_ME_PASSWORD below with your real password (keep it out of Git!).
-- 2) Run.  3) Sign in at /admin with username admin-fara and that password.
--
-- Alternative without SQL: Authentication → Users → Add user →
--   email admin-fara@faradilahade.github.io, your password, tick "Auto Confirm User".
-- ============================================================
do $$
declare
  v_email    text := 'admin-fara@faradilahade.github.io';
  v_password text := 'CHANGE_ME_PASSWORD';
  v_uid      uuid := gen_random_uuid();
begin
  if v_password = 'CHANGE_ME_PASSWORD' then
    raise exception 'Edit the script first: replace CHANGE_ME_PASSWORD with your real password.';
  end if;

  if exists (select 1 from auth.users where email = v_email) then
    raise notice 'User % already exists — nothing to do.', v_email;
    return;
  end if;

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    email_change_token_current, phone_change, phone_change_token, reauthentication_token,
    is_sso_user, is_anonymous
  ) values (
    '00000000-0000-0000-0000-000000000000', v_uid, 'authenticated', 'authenticated', v_email,
    extensions.crypt(v_password, extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{"username":"admin-fara"}'::jsonb, now(), now(),
    '', '', '', '', '', '', '', '', false, false
  );

  insert into auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(), v_uid,
    jsonb_build_object('sub', v_uid::text, 'email', v_email, 'email_verified', true),
    'email', v_uid::text, now(), now(), now()
  );

  raise notice 'Created admin user %', v_email;
end $$;
