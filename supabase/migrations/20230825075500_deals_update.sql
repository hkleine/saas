alter table "public"."deals" add column "customer_name" text;

alter table "public"."deals" add column "description" text;

alter table "public"."deals" add column "estimated_value" double precision;

alter table "public"."deals" alter column "id" set default gen_random_uuid();

alter table "public"."deals" disable row level security;


