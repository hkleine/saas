insert into
public.roles (id, name)
values
(0, 'Company'),
(1, 'Overhead'),
(2, 'Ausbilder'),
(3, 'Azubi');


INSERT INTO auth.users (instance_id,id,aud,"role",email,encrypted_password,email_confirmed_at,last_sign_in_at,raw_app_meta_data,raw_user_meta_data,is_super_admin,created_at,updated_at,phone,phone_confirmed_at,confirmation_token,email_change,email_change_token_new,recovery_token) VALUES
	('00000000-0000-0000-0000-000000000000'::uuid,'f76629c5-a070-4bbc-9918-64beaea48848'::uuid,'authenticated','authenticated','hendrik-kleine@gmx.de','$2a$10$VMiwFKSoEssQ2hd4iivPOun8CcQr/gVabNSFvYfIRmVWjZMEBP1L6','2022-02-11 21:02:04.547','2022-02-11 22:53:12.520','{"provider": "email", "providers": ["email"]}','{}',FALSE,'2022-02-11 21:02:04.542','2022-02-11 21:02:04.542',NULL,NULL,'','','','')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, name, avatar_url,billing_address,payment_method,role) VALUES
	((select id from auth.users where email = 'hendrik-kleine@gmx.de'),'Kleine Investment',NULL,NULL,NULL,0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.consultants (id,percent,upline,company_id) VALUES
	((select id from public.users where name = 'Kleine Investment'),90,NULL,NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.items (id,equation,variables,company_id,name) VALUES
	('00000000-0000-0000-0000-000000000002'::uuid,'y=x',{"x":{"name":"Menge"},"y":{"name":"Summe"}},(select id from public.users where name = 'Kleine Investment'),'Nürnberger Würstchen')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.earnings (id,date,value,consultant_id,item) VALUES
	('00000000-0000-0000-0000-000000000001'::uuid,'2023-07-03 09:24:32.630229',0,(select id from public.users where name = 'Kleine Investment'))
ON CONFLICT (id) DO NOTHING;
