create type "public"."pricing_plan_interval" as enum ('day', 'week', 'month', 'year');

create type "public"."pricing_type" as enum ('one_time', 'recurring');

create type "public"."subscription_status" as enum ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid');

create sequence "public"."roles_id_seq";

create table "public"."consultants" (
    "id" uuid not null,
    "percent" real not null,
    "upline" uuid,
    "company_id" uuid
);


create table "public"."customers" (
    "id" uuid not null,
    "stripe_customer_id" text
);


alter table "public"."customers" enable row level security;

create table "public"."earnings" (
    "id" uuid not null default uuid_generate_v4(),
    "date" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "value" double precision not null default '0'::double precision,
    "consultant_id" uuid not null,
    "item_id" uuid
);


create table "public"."items" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default now(),
    "company_id" uuid default gen_random_uuid(),
    "equation" character varying,
    "variables" jsonb,
    "name" character varying
);


create table "public"."prices" (
    "id" text not null,
    "product_id" text,
    "active" boolean,
    "description" text,
    "unit_amount" bigint,
    "currency" text,
    "type" pricing_type,
    "interval" pricing_plan_interval,
    "interval_count" integer,
    "trial_period_days" integer,
    "metadata" jsonb
);


alter table "public"."prices" enable row level security;

create table "public"."products" (
    "id" text not null,
    "active" boolean,
    "name" text,
    "description" text,
    "image" text,
    "metadata" jsonb
);


alter table "public"."products" enable row level security;

create table "public"."roles" (
    "id" integer not null default nextval('roles_id_seq'::regclass),
    "name" text not null
);


create table "public"."subscriptions" (
    "id" text not null,
    "user_id" uuid not null,
    "status" subscription_status,
    "metadata" jsonb,
    "price_id" text,
    "quantity" integer,
    "cancel_at_period_end" boolean,
    "created" timestamp with time zone not null default timezone('utc'::text, now()),
    "current_period_start" timestamp with time zone not null default timezone('utc'::text, now()),
    "current_period_end" timestamp with time zone not null default timezone('utc'::text, now()),
    "ended_at" timestamp with time zone default timezone('utc'::text, now()),
    "cancel_at" timestamp with time zone default timezone('utc'::text, now()),
    "canceled_at" timestamp with time zone default timezone('utc'::text, now()),
    "trial_start" timestamp with time zone default timezone('utc'::text, now()),
    "trial_end" timestamp with time zone default timezone('utc'::text, now())
);


alter table "public"."subscriptions" enable row level security;

create table "public"."users" (
    "id" uuid not null,
    "name" text,
    "avatar_url" text,
    "billing_address" jsonb,
    "payment_method" jsonb,
    "role" integer not null default 0
);


alter table "public"."users" enable row level security;

alter sequence "public"."roles_id_seq" owned by "public"."roles"."id";

CREATE UNIQUE INDEX consultants_pkey ON public.consultants USING btree (id);

CREATE UNIQUE INDEX customers_pkey ON public.customers USING btree (id);

CREATE UNIQUE INDEX earnings_pkey ON public.earnings USING btree (id);

CREATE UNIQUE INDEX equations_pkey ON public.items USING btree (id);

CREATE UNIQUE INDEX prices_pkey ON public.prices USING btree (id);

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

CREATE UNIQUE INDEX roles_pkey ON public.roles USING btree (id);

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."consultants" add constraint "consultants_pkey" PRIMARY KEY using index "consultants_pkey";

alter table "public"."customers" add constraint "customers_pkey" PRIMARY KEY using index "customers_pkey";

alter table "public"."earnings" add constraint "earnings_pkey" PRIMARY KEY using index "earnings_pkey";

alter table "public"."items" add constraint "equations_pkey" PRIMARY KEY using index "equations_pkey";

alter table "public"."prices" add constraint "prices_pkey" PRIMARY KEY using index "prices_pkey";

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."roles" add constraint "roles_pkey" PRIMARY KEY using index "roles_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."consultants" add constraint "consultants_company_id_fkey" FOREIGN KEY (company_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."consultants" validate constraint "consultants_company_id_fkey";

alter table "public"."consultants" add constraint "consultants_id_fkey" FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."consultants" validate constraint "consultants_id_fkey";

alter table "public"."consultants" add constraint "consultants_upline_fkey" FOREIGN KEY (upline) REFERENCES consultants(id) ON DELETE CASCADE not valid;

alter table "public"."consultants" validate constraint "consultants_upline_fkey";

alter table "public"."customers" add constraint "customers_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."customers" validate constraint "customers_id_fkey";

alter table "public"."earnings" add constraint "earnings_consultant_id_fkey" FOREIGN KEY (consultant_id) REFERENCES consultants(id) ON DELETE CASCADE not valid;

alter table "public"."earnings" validate constraint "earnings_consultant_id_fkey";

alter table "public"."earnings" add constraint "earnings_item_id_fkey" FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE not valid;

alter table "public"."earnings" validate constraint "earnings_item_id_fkey";

alter table "public"."items" add constraint "items_company_id_fkey" FOREIGN KEY (company_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."items" validate constraint "items_company_id_fkey";

alter table "public"."prices" add constraint "prices_currency_check" CHECK ((char_length(currency) = 3)) not valid;

alter table "public"."prices" validate constraint "prices_currency_check";

alter table "public"."prices" add constraint "prices_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) not valid;

alter table "public"."prices" validate constraint "prices_product_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_price_id_fkey" FOREIGN KEY (price_id) REFERENCES prices(id) not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_price_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_user_id_fkey";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

alter table "public"."users" add constraint "users_role_fkey" FOREIGN KEY (role) REFERENCES roles(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_role_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_user_is_in_same_company(user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$declare
  user_role int;

begin
  select role
  from public.users 
  where users.id = user_id  
  into user_role;

  IF EXISTS(select * from public.users 
  join public.consultants on users.id = consultants.id
  where users.id = user_id or consultants.company_id = user_id) then
    return true;
  END IF;
  return true;
end;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.users (id, name, role)
  values (new.id, new.raw_user_meta_data->>'name', (new.raw_user_meta_data->>'role')::int);

  insert into public.consultants (id, percent, upline, company_id)
  values ((new.id)::uuid,(new.raw_user_meta_data->>'percent')::float, (new.raw_user_meta_data->>'upline')::uuid, (new.raw_user_meta_data->>'company_id')::uuid);
  
  return new;
end;
$function$
;

create policy "Allow public read-only access."
on "public"."prices"
as permissive
for select
to public
using (true);


create policy "Allow public read-only access."
on "public"."products"
as permissive
for select
to public
using (true);


create policy "Can only view own subs data."
on "public"."subscriptions"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Update users"
on "public"."users"
as permissive
for update
to public
using (true);


create policy "view company users"
on "public"."users"
as permissive
for select
to public
using (check_user_is_in_same_company(auth.uid()));



