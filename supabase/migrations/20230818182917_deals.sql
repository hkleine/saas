create table "public"."deal_items" (
    "deal_id" uuid not null,
    "item_id" uuid not null
);


create table "public"."deals" (
    "id" uuid not null,
    "created_at" timestamp with time zone default now(),
    "consultant_id" uuid,
    "name" text
);


alter table "public"."deals" enable row level security;

CREATE UNIQUE INDEX deal_items_pkey ON public.deal_items USING btree (deal_id, item_id);

CREATE UNIQUE INDEX dels_pkey ON public.deals USING btree (id);

alter table "public"."deal_items" add constraint "deal_items_pkey" PRIMARY KEY using index "deal_items_pkey";

alter table "public"."deals" add constraint "dels_pkey" PRIMARY KEY using index "dels_pkey";

alter table "public"."deal_items" add constraint "deal_items_deal_id_fkey" FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE not valid;

alter table "public"."deal_items" validate constraint "deal_items_deal_id_fkey";

alter table "public"."deal_items" add constraint "deal_items_item_id_fkey" FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE not valid;

alter table "public"."deal_items" validate constraint "deal_items_item_id_fkey";

alter table "public"."deals" add constraint "deals_consultant_id_fkey" FOREIGN KEY (consultant_id) REFERENCES consultants(id) ON DELETE CASCADE not valid;

alter table "public"."deals" validate constraint "deals_consultant_id_fkey";


