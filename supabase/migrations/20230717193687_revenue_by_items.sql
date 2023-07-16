alter table "public"."earnings" add column "item_id" uuid;

alter table "public"."earnings" add constraint "earnings_item_id_fkey" FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE not valid;

alter table "public"."earnings" validate constraint "earnings_item_id_fkey";


