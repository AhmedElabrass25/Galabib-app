create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 2 and 100),
  phone text not null check (char_length(phone) >= 8),
  notes text not null default '' check (char_length(notes) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  customer_id uuid not null,
  garment_type text not null check (garment_type in ('balady', 'afrangy', 'saudi')),
  quantity integer not null check (quantity between 1 and 100),
  sadary_count integer not null default 0 check (sadary_count >= 0),
  delivery_date date not null,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'ready', 'delivered', 'cancelled')),
  notes text not null default '' check (char_length(notes) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id),
  constraint orders_customer_owner_fkey
    foreign key (customer_id, owner_id)
    references public.customers (id, owner_id)
    on delete cascade
);

create table if not exists public.measurements (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  order_id uuid not null,
  field_name text not null,
  value numeric(7, 2) not null check (value > 0 and value <= 999),
  unit text not null check (unit in ('cm', 'inch')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  constraint measurements_order_owner_fkey
    foreign key (order_id, owner_id)
    references public.orders (id, owner_id)
    on delete cascade
);

create table if not exists public.order_options (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  order_id uuid not null,
  option_name text not null,
  option_value text not null,
  created_at timestamptz not null default now(),
  constraint order_options_order_owner_fkey
    foreign key (order_id, owner_id)
    references public.orders (id, owner_id)
    on delete cascade
);

create index if not exists orders_owner_created_at_idx
  on public.orders (owner_id, created_at desc);
create index if not exists orders_customer_id_idx
  on public.orders (customer_id);
create index if not exists orders_status_idx
  on public.orders (owner_id, status);
create index if not exists orders_garment_type_idx
  on public.orders (owner_id, garment_type);
create index if not exists measurements_order_id_idx
  on public.measurements (order_id);
create index if not exists order_options_order_id_idx
  on public.order_options (order_id);

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.measurements enable row level security;
alter table public.order_options enable row level security;

drop policy if exists "Owners can manage their customers" on public.customers;
create policy "Owners can manage their customers"
on public.customers for all to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "Owners can manage their orders" on public.orders;
create policy "Owners can manage their orders"
on public.orders for all to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "Owners can manage their measurements" on public.measurements;
create policy "Owners can manage their measurements"
on public.measurements for all to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "Owners can manage their order options" on public.order_options;
create policy "Owners can manage their order options"
on public.order_options for all to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

grant usage on schema public to authenticated;
grant select, insert, update, delete
on public.customers, public.orders, public.measurements, public.order_options
to authenticated;
revoke all on public.customers, public.orders, public.measurements, public.order_options
from anon;