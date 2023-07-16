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
