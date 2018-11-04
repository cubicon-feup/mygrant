ALTER TABLE public.crowdfunding 
ADD latitude double precision, ADD longitude double precision;

CREATE TABLE public.association (
	id serial,
	name text NOT NULL,
	description text NOT NULL
);

