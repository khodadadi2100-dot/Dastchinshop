-- دستچین V3 / Supabase schema
create extension if not exists pgcrypto;

do $$ begin
  create type public.user_role as enum ('customer','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_status as enum ('new','confirmed','preparing','out_for_delivery','delivered','cancelled');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text default '',
  phone text default '',
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category text not null default 'لبنیات',
  meta text not null default '',
  price integer not null check (price >= 0),
  image_url text default '',
  stock integer not null default 0 check (stock >= 0),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'آدرس من',
  address_text text not null,
  lat double precision,
  lng double precision,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  address_id uuid references public.addresses(id) on delete set null,
  status public.order_status not null default 'new',
  payment_method text not null default 'cash_on_delivery',
  payment_status text not null default 'pending',
  subtotal integer not null default 0,
  delivery_fee integer not null default 0,
  total integer not null default 0,
  note text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price integer not null,
  quantity integer not null check (quantity > 0),
  line_total integer not null
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles(id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), coalesce(new.raw_user_meta_data->>'phone',''))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin'); $$;

create or replace function public.place_order(p_address_id uuid, p_items jsonb, p_note text default '')
returns uuid language plpgsql security definer set search_path = public
as $$
declare
  v_order_id uuid;
  v_subtotal integer := 0;
  item jsonb;
  v_product public.products%rowtype;
  v_qty integer;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then raise exception 'EMPTY_CART'; end if;

  insert into public.orders(user_id,address_id,note) values(auth.uid(),p_address_id,coalesce(p_note,'')) returning id into v_order_id;

  for item in select * from jsonb_array_elements(p_items) loop
    select * into v_product from public.products where id = (item->>'product_id')::uuid and active = true for update;
    if not found then raise exception 'PRODUCT_NOT_FOUND'; end if;
    v_qty := greatest(1, (item->>'quantity')::integer);
    if v_product.stock < v_qty then raise exception 'OUT_OF_STOCK:%', v_product.name; end if;
    insert into public.order_items(order_id,product_id,product_name,unit_price,quantity,line_total)
      values(v_order_id,v_product.id,v_product.name,v_product.price,v_qty,v_product.price*v_qty);
    v_subtotal := v_subtotal + v_product.price*v_qty;
    update public.products set stock = stock - v_qty, updated_at = now() where id = v_product.id;
  end loop;

  update public.orders set subtotal=v_subtotal, delivery_fee=0, total=v_subtotal, updated_at=now() where id=v_order_id;
  return v_order_id;
exception when others then
  raise;
end; $$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Public catalog
 drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products for select to anon, authenticated using (active = true or public.is_admin());

-- Customer profile
 drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Addresses
 drop policy if exists addresses_self_all on public.addresses;
create policy addresses_self_all on public.addresses for all to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());

-- Orders
 drop policy if exists orders_self_read on public.orders;
create policy orders_self_read on public.orders for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists orders_admin_update on public.orders;
create policy orders_admin_update on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Order items
 drop policy if exists order_items_self_read on public.order_items;
create policy order_items_self_read on public.order_items for select to authenticated using (exists(select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));

-- Admin product management
 drop policy if exists products_admin_insert on public.products;
create policy products_admin_insert on public.products for insert to authenticated with check (public.is_admin());
drop policy if exists products_admin_update on public.products;
create policy products_admin_update on public.products for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists products_admin_delete on public.products;
create policy products_admin_delete on public.products for delete to authenticated using (public.is_admin());

-- Grants needed by browser roles. Keep service_role server-only.
grant select on public.products to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.addresses to authenticated;
grant select, update on public.orders to authenticated;
grant select on public.order_items to authenticated;
grant insert, update, delete on public.products to authenticated;
grant execute on function public.place_order(uuid,jsonb,text) to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- Storage bucket for product images (admin uploads only).
insert into storage.buckets (id, name, public) values ('product-images','product-images',true)
on conflict (id) do nothing;

drop policy if exists product_images_public_read on storage.objects;
create policy product_images_public_read on storage.objects for select to anon, authenticated using (bucket_id = 'product-images');
drop policy if exists product_images_admin_insert on storage.objects;
create policy product_images_admin_insert on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());
drop policy if exists product_images_admin_update on storage.objects;
create policy product_images_admin_update on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.is_admin()) with check (bucket_id = 'product-images' and public.is_admin());
drop policy if exists product_images_admin_delete on storage.objects;
create policy product_images_admin_delete on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());

-- Seed the 8 current products. Images remain local in V3 until admin replaces them.
insert into public.products(name,slug,category,meta,price,image_url,stock,active,sort_order) values
('شیر','milk','لبنیات','۱ لیتری',38000,'assets/product-milk.jpg',100,true,1),
('ماست','yogurt','لبنیات','۹۰۰ گرمی',34000,'assets/product-yogurt.jpg',100,true,2),
('دوغ','doogh','لبنیات','۱.۵ لیتری',28000,'assets/product-doogh.jpg',100,true,3),
('پنیر','cheese','لبنیات','۴۰۰ گرمی',48000,'assets/product-cheese.jpg',100,true,4),
('خامه','cream','لبنیات','۲۰۰ گرمی',48000,'assets/product-cream.jpg',100,true,5),
('ماست چکیده','strained','لبنیات','۴۰۰ گرمی',52000,'assets/product-strained.jpg',100,true,6),
('ماست و موسیر','musir','لبنیات','۵۰۰ گرمی',48000,'assets/product-musir.jpg',100,true,7),
('کشک','kashk','لبنیات','۴۵۰ گرمی',45000,'assets/product-kashk.jpg',100,true,8)
on conflict (slug) do update set name=excluded.name, meta=excluded.meta, price=excluded.price, image_url=excluded.image_url, sort_order=excluded.sort_order;
