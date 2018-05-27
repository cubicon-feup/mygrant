-- requires at least postgres 9.6

-- alters
ALTER TABLE public.service
ADD COLUMN IF NOT EXISTS latitude double precision,
ADD COLUMN IF NOT EXISTS longitude double precision;

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS latitude double precision,
ADD COLUMN IF NOT EXISTS longitude double precision;

ALTER TABLE public.service_offer
ADD COLUMN IF NOT EXISTS date_proposed timestamp with time zone;
 
ALTER TABLE public.crowdfunding_offer
ADD COLUMN IF NOT EXISTS date_proposed timestamp with time zone;

-- inserts
ALTER TABLE public.service
DISABLE TRIGGER remove_service_offer_on_delete_service;

UPDATE public.service 
SET latitude=random()*180-90, longitude=random()*360-180;

ALTER TABLE public.service
ENABLE TRIGGER remove_service_offer_on_delete_service;

UPDATE public.users 
SET latitude=random()*180-90, longitude=random()*360-180;
/*
UPDATE public.service_offer
    SET date_proposed = null;

UPDATE public.crowdfunding_offer
    SET date_proposed = null;
*/
