CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA public;

-- init user and product
DO
$do$
DECLARE
user_id uuid;
product_id uuid;
cart_id uuid;
password text;
BEGIN 
   	FOR i IN 1..25 LOOP
		password = encode(hmac('password':: text, '123':: text, 'sha256'::text), 'hex');
		user_id = uuid_generate_v4();
		INSERT INTO public.user(id, account, password) values(user_id, 'account' || i, password);
		INSERT INTO public.user_profile(user_id, name, credit, created_time, last_login_time)
			values(user_id, 'user name ' || i, i * 100, now(), now());
   	END LOOP;
				   
	FOR i IN 1..30 LOOP
		product_id = uuid_generate_v4();
		INSERT INTO product(id, name, stock, price) 
			values(product_id, 'product' || i, floor(i * random() * 10 + 1)::int, floor(random() * 3000 + 1)::int);
	END LOOP;
END
$do$;

-- Each user add 1 ~ 5 checkout history and 1 pending histroy
DO
$$
DECLARE
usr public.user;
cart_id uuid;
BEGIN	   
	FOR usr in select * from public.user Loop
		
		FOR i in 1..floor(random() * 5 + 1) LOOP
			cart_id = uuid_generate_v4();
			INSERT INTO user_history(cart_id, user_id, created_time, last_update_time, state)
				values(cart_id, usr.id, now(), now(), '1');
		END LOOP;
		cart_id = uuid_generate_v4();
		INSERT INTO user_history(cart_id, user_id, created_time, last_update_time, state)
				values(cart_id, usr.id, now(), now(), '0');
	END LOOP;	   
END
$$;

-- each cart has 1 ~ 5 prodcuts
DO
$$
DECLARE
history public.user_history;
cart_id uuid;
product_id uuid;
BEGIN	   
	FOR history in select * from public.user_history Loop
        FOR product_id in 
            select id 
            from product 
            offset(floor(random()) * 25) limit floor(random() * 5) LOOP
                INSERT INTO cart(id, product_id, amount, state, created_time)
                    values(history.cart_id, product_id, floor(random() * 5 + 1), history.state, now());
        END LOOP;   
		
	END LOOP;	   
END
$$;