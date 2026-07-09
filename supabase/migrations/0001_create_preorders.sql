create table if not exists preorders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  flavor text not null,
  purchase_type text not null default 'one-time',
  quantity integer not null default 1,
  source_page text,
  created_at timestamptz not null default now()
);

create index if not exists preorders_email_idx on preorders (email);

-- RLS is on with no policies: the API route writes using the service role
-- key, which bypasses RLS. No anon/authenticated access is granted.
alter table preorders enable row level security;
