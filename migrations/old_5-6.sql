DROP SCHEMA public CASCADE; 
CREATE SCHEMA public; 
-- DATABASE SETTINGS
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', 'public', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;
CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
SET default_with_oids = false;
-- /DATABASE SETTINGS

-- CREATE ENUMS
CREATE TYPE public.crowdfunding_statuses AS ENUM (
    'COLLECTING',
    'RECRUITING',
    'FINISHED'
);
CREATE TYPE public.service_categories AS ENUM (
    'BUSINESS',
    'ARTS',
    'LEARNING',
    'PETS',
    'HOME',
    'FITNESS',
    'FUN'
);
CREATE TYPE public.service_types AS ENUM (
    'PROVIDE',
    'REQUEST'
);
-- /CREATE ENUMS

-- CREATE TABLES
CREATE TABLE public.achievement (
    id integer NOT NULL,
    achievement_name text NOT NULL,
    description text NOT NULL,
    exp_reward integer DEFAULT 0 NOT NULL,
    image_url text NOT NULL
);
CREATE SEQUENCE public.achievement_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;
ALTER SEQUENCE public.achievement_id_seq OWNED BY public.achievement.id;

CREATE TABLE public.blocked (
    blocker_id integer NOT NULL,
    target_id integer NOT NULL,
    date_blocked timestamp with time zone DEFAULT now()
);

CREATE TABLE public.comment (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    message text NOT NULL,
    service_id integer,
    crowdfunding_id integer,
    date_posted timestamp with time zone DEFAULT now() NOT NULL,
    in_reply_to integer,
    edit_history text[]
);
CREATE SEQUENCE public.comment_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;
ALTER SEQUENCE public.comment_id_seq OWNED BY public.comment.id;

CREATE TABLE public.country (
    id integer NOT NULL,
    name text NOT NULL,
    code text NOT NULL
);
CREATE SEQUENCE public.country_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;
ALTER SEQUENCE public.country_id_seq OWNED BY public.country.id;

CREATE TABLE public.crowdfunding (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    category public.service_categories NOT NULL,
    location text,
    latitude double precision,
    longitude double precision,
    date_created timestamp with time zone DEFAULT now() NOT NULL,
    date_finished timestamp with time zone NOT NULL,
    status public.crowdfunding_statuses DEFAULT 'RECRUITING'::public.crowdfunding_statuses NOT NULL,
    recruiting_balance integer DEFAULT 0 NOT NULL,
    collected_balance integer DEFAULT 0 NOT NULL,
    creator_id integer NOT NULL,
    deleted boolean DEFAULT false NOT NULL
);
CREATE SEQUENCE public.crowdfunding_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;
ALTER SEQUENCE public.crowdfunding_id_seq OWNED BY public.crowdfunding.id;

CREATE TABLE public.crowdfunding_donation (
    id integer NOT NULL,
    crowdfunding_id integer NOT NULL,
    donator_id integer NOT NULL,
    amount integer NOT NULL,
    date_sent timestamp with time zone DEFAULT now() NOT NULL,
    rating integer
);
CREATE SEQUENCE public.crowdfunding_donation_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;
ALTER SEQUENCE public.crowdfunding_donation_id_seq OWNED BY public.crowdfunding_donation.id;

CREATE TABLE public.crowdfunding_image (
    crowdfunding_id integer NOT NULL,
    image_url text NOT NULL
);

CREATE TABLE public.crowdfunding_offer (
    service_id integer NOT NULL,
    crowdfunding_id integer NOT NULL,
    date_proposed timestamp with time zone
);

CREATE TABLE public.donation (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    amount integer NOT NULL,
    date_sent timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.donation_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;
ALTER SEQUENCE public.donation_id_seq OWNED BY public.donation.id;

CREATE TABLE public.donation_request (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    amount integer NOT NULL,
    date_sent timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.donation_request_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;
ALTER SEQUENCE public.donation_request_id_seq OWNED BY public.donation_request.id;

CREATE TABLE public.friend (
    user1_id integer NOT NULL,
    user2_id integer NOT NULL,
    date_added timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.friend_request (
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    date_sent timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.like_post (
    user_id integer NOT NULL,
    post_id integer NOT NULL
);

CREATE TABLE public.loan (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    amount integer NOT NULL,
    date_sent timestamp with time zone DEFAULT now() NOT NULL,
    date_max_repay timestamp with time zone NOT NULL
);
CREATE SEQUENCE public.loan_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;
ALTER SEQUENCE public.loan_id_seq OWNED BY public.loan.id;

CREATE TABLE public.loan_request (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    amount integer NOT NULL,
    date_sent timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.loan_request_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;
ALTER SEQUENCE public.loan_request_id_seq OWNED BY public.loan_request.id;

CREATE TABLE public.message (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    date_sent timestamp with time zone DEFAULT now() NOT NULL,
    content text NOT NULL
);
CREATE SEQUENCE public.message_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;
ALTER SEQUENCE public.message_id_seq OWNED BY public.message.id;

CREATE TABLE public.portfolio (
    user_id integer NOT NULL,
    image_url text NOT NULL
);

CREATE TABLE public.post (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    message text NOT NULL,
    in_reply_to integer,
    edit_history text[],
    date_posted timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.post_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;
ALTER SEQUENCE public.post_id_seq OWNED BY public.post.id;

CREATE TABLE public.post_image (
    post_id integer NOT NULL,
    image_url text NOT NULL
);

CREATE TABLE public.report (
    id integer NOT NULL,
    reporter_id integer NOT NULL,
    reason text,
    user_id integer,
    service_id integer,
    crowdfunding_id integer,
    post_id integer,
    comment_id integer,
    date_reported timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.report_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;
ALTER SEQUENCE public.report_id_seq OWNED BY public.report.id;

CREATE TABLE public.service (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    category public.service_categories NOT NULL,
    location text,
    latitude double precision,
    longitude double precision,
    acceptable_radius integer,
    mygrant_value integer NOT NULL,
    date_created timestamp with time zone DEFAULT now() NOT NULL,
    service_type public.service_types NOT NULL,
    creator_id integer,
    crowdfunding_id integer,
    repeatable boolean DEFAULT false NOT NULL,
    deleted boolean DEFAULT false NOT NULL
);
CREATE SEQUENCE public.service_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;
ALTER SEQUENCE public.service_id_seq OWNED BY public.service.id;

CREATE TABLE public.service_image (
    service_id integer NOT NULL,
    image_url text NOT NULL
);

CREATE TABLE public.service_instance (
    id integer NOT NULL,
    service_id integer NOT NULL,
    partner_id integer,
    crowdfunding_id integer,
    date_agreed timestamp with time zone DEFAULT now() NOT NULL,
    date_scheduled timestamp with time zone,
    creator_rating integer,
    partner_rating integer
);
CREATE SEQUENCE public.service_instance_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;
ALTER SEQUENCE public.service_instance_id_seq OWNED BY public.service_instance.id;

CREATE TABLE public.service_offer (
    service_id integer NOT NULL,
    candidate_id integer NOT NULL,
    date_proposed timestamp with time zone
);

CREATE TABLE public.user_achievement (
    user_id integer NOT NULL,
    achievement_id integer NOT NULL,
    date_earned timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    pass_hash text NOT NULL,
    date_joined timestamp with time zone DEFAULT now() NOT NULL,
    full_name text NOT NULL,
    bio text,
    phone text,
    city text,
    region text,
    country_id integer,
    latitude double precision,
    longitude double precision,
    image_url text,
    level integer DEFAULT 1 NOT NULL,
    experience_points integer DEFAULT 0 NOT NULL,
    mygrant_balance integer DEFAULT 0 NOT NULL,
    date_last_transaction timestamp with time zone DEFAULT now() NOT NULL,
    max_weekly_hours integer DEFAULT 0 NOT NULL,
    high_level boolean DEFAULT false NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    weekly_hours_remaining integer DEFAULT 0 NOT NULL,
    notification_message boolean DEFAULT true NOT NULL
);
CREATE SEQUENCE public.user_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;
ALTER SEQUENCE public.user_id_seq OWNED BY public.users.id;
-- /CREATE TABLES

-- CREATE FUNCTIONS
CREATE FUNCTION public.change_crowdfunding_recruiting_balance(crowdfunding_id integer, amount integer) RETURNS void
LANGUAGE plpgsql
AS $$BEGIN
IF EXISTS (SELECT * FROM crowdfunding WHERE crowdfunding.id=crowdfunding_id AND crowdfunding.status='RECRUITING'::crowdfunding_statuses) THEN
    UPDATE public.crowdfunding SET recruiting_balance = recruiting_balance + amount WHERE crowdfunding.id = crowdfunding_id;
ELSE
    RAISE EXCEPTION 'Crowdfunding not recruiting';
END IF;
END;
$$;

CREATE FUNCTION public.change_crowdfunding_collected_balance(crowdfunding_id integer, amount integer) RETURNS void
LANGUAGE plpgsql
AS $$BEGIN
IF EXISTS (SELECT * FROM crowdfunding WHERE crowdfunding.id=crowdfunding_id AND crowdfunding.status='COLLECTING'::crowdfunding_statuses) THEN
    UPDATE public.crowdfunding SET collected_balance = collected_balance + amount WHERE crowdfunding.id = crowdfunding_id;
ELSE
    RAISE EXCEPTION 'Crowdfunding not collecting';
END IF;
END;
$$;

CREATE FUNCTION public.crowdfunding_reached_goal(crowdfunding_id integer) RETURNS boolean
LANGUAGE plpgsql
AS $$BEGIN
RETURN EXISTS (
    SELECT * FROM crowdfunding
    WHERE crowdfunding.id=crowdfunding_id
    AND collected_balance>=recruiting_balance);
END;
$$;

CREATE FUNCTION public.delete_service_instance(service_id integer) RETURNS void
LANGUAGE plpgsql
AS $$BEGIN
DELETE FROM service_instance
WHERE service_instance.service_id=service_id;
END;
$$;

CREATE FUNCTION public.crowdfunding_finished() RETURNS trigger
LANGUAGE plpgsql
AS $$BEGIN
IF (NEW.status='FINISHED'::public.crowdfunding_statuses AND NEW.collected_balance<NEW.recruiting_balance) THEN
    DELETE FROM service_instance WHERE crowdfunding_id=NEW.id;
    SELECT delete_service_instance(id) FROM service WHERE crowdfunding_id=NEW.id;
    SELECT change_user_mygrant_balance(donator_id, amount) FROM crowdfunding_donation WHERE crowdfunding_id=NEW.id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE FUNCTION public.change_user_mygrant_balance(user_id integer, amount integer) RETURNS void
LANGUAGE plpgsql
AS $$BEGIN
UPDATE public.users SET mygrant_balance = mygrant_balance + amount WHERE users.id = user_id;
END;
$$;

CREATE FUNCTION public.change_user_weekly_hours(user_id integer, n_hours integer) RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.users SET weekly_hours_remaining = weekly_hours_remaining + n_hours WHERE users.id = user_id;
END;
$$;

CREATE FUNCTION public.check_if_same_creator(service_id integer, crowdfunding_id integer) RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN
    (SELECT creator_id FROM public.service WHERE service.id=service_id)
    =
    (SELECT creator_id FROM public.crowdfunding WHERE crowdfunding.id=crowdfunding_id);
END;
$$;

CREATE FUNCTION public.check_if_service_creator(service_id integer, user_id integer) RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN EXISTS (
        SELECT *
        FROM public.service
        WHERE service.id = service_id AND
        service.creator_id = user_id);
END;
$$;

CREATE FUNCTION public.check_if_users_friends(id1 integer, id2 integer) RETURNS boolean
LANGUAGE plpgsql
AS $$BEGIN
RETURN EXISTS (
    SELECT *
    FROM public.friend
    WHERE (user1_id=id1 AND user2_id=id2)
    OR (user2_id=id1 AND user1_id=id2)
);
END;
$$;

CREATE FUNCTION public.check_in_reply_to_comment(original_id integer, reply_id integer) RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE next_id integer;
BEGIN
    IF (reply_id IS NULL) THEN
        RETURN TRUE;
    ELSIF (reply_id=original_id) THEN
        RETURN FALSE;
    ELSE
        next_id := (SELECT in_reply_to FROM public.comment WHERE comment.id=reply_id);
        RETURN public.check_in_reply_to_comment(original_id, next_id);
END IF;
END;
$$;

CREATE FUNCTION public.check_in_reply_to_post(original_id integer, reply_id integer) RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE next_id integer;
BEGIN
    IF (reply_id IS NULL) THEN
        RETURN TRUE;
    ELSIF (reply_id=original_id) THEN
        RETURN FALSE;
    ELSE
        next_id := (SELECT in_reply_to FROM public.post WHERE post.id=reply_id);
        RETURN public.check_in_reply_to_post(original_id, next_id);
END IF;
END;
$$;

CREATE FUNCTION public.crowdfunding_check_status_donation() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT * FROM crowdfunding WHERE crowdfunding.id=NEW.crowdfunding_id AND crowdfunding.status='COLLECTING'::crowdfunding_statuses AND crowdfunding.deleted=false) THEN
        RETURN NEW;
END IF;
RAISE EXCEPTION 'Crowdfunding not collecting';
END;
$$;

CREATE FUNCTION public.crowdfunding_check_status_offer() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF (TG_TABLE_NAME='crowdfunding_offer') THEN
        IF EXISTS (SELECT * FROM crowdfunding WHERE crowdfunding.id=NEW.crowdfunding_id AND crowdfunding.status='RECRUITING'::crowdfunding_statuses) THEN
            RETURN NEW;
    END IF;
ELSIF (TG_TABLE_NAME='service_offer') THEN
    IF EXISTS (SELECT * FROM crowdfunding WHERE crowdfunding.id=(SELECT crowdfunding_id FROM service WHERE service.id=NEW.service_id) AND crowdfunding.status='RECRUITING'::crowdfunding_statuses AND crowdfunding.deleted=false)
        OR (SELECT crowdfunding_id FROM service WHERE service.id=NEW.service_id) IS NULL THEN
        RETURN NEW;
    END IF;
END IF;
RAISE EXCEPTION 'Crowdfunding not recruiting';
END;
$$;

CREATE FUNCTION public.service_check_status() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT * FROM service WHERE service.id=NEW.service_id AND deleted=false) THEN
        RETURN NEW;
END IF;
RAISE EXCEPTION 'Service has been deleted';
END;
$$;

CREATE FUNCTION public.pay_on_service_instance() RETURNS trigger
LANGUAGE plpgsql
AS $$DECLARE
payer_id integer;
provider_id integer;
is_crowdfunding boolean;
value integer;
type text;
creator integer;
crowdfunding integer;
BEGIN
    SELECT service_type, mygrant_value, creator_id, crowdfunding_id INTO type, value, creator, crowdfunding FROM public.service WHERE service.id=NEW.service_id;
    IF (type = 'REQUEST' AND NEW.partner_id IS NOT NULL) THEN
        IF (creator IS NOT NULL) THEN
            payer_id := creator;
            provider_id := NEW.partner_id;
            is_crowdfunding := FALSE;
        ELSIF (crowdfunding IS NOT NULL) THEN
            payer_id := crowdfunding;
            provider_id := NEW.partner_id;
            is_crowdfunding := TRUE;
    END IF;
ELSIF (type = 'PROVIDE' AND creator IS NOT NULL) THEN
    IF (creator IS NOT NULL) THEN
        payer_id := NEW.partner_id;
        provider_id := creator;
        is_crowdfunding := FALSE;
    ELSIF (crowdfunding IS NOT NULL) THEN
        payer_id := NEW.crowdfunding_id;
        provider_id := creator;
        is_crowdfunding := TRUE;
    END IF;
END IF;

IF is_crowdfunding THEN
    EXECUTE public.change_crowdfunding_recruiting_balance(payer_id, value);
ELSE
    EXECUTE public.change_user_mygrant_balance(payer_id, -value);
END IF;
EXECUTE public.change_user_weekly_hours(provider_id, -value);

RETURN NEW;
END;
$$;

CREATE FUNCTION public.deduct_on_service_offer() RETURNS trigger
LANGUAGE plpgsql
AS $$DECLARE
type service_types;
value integer;
BEGIN
    SELECT service_type, mygrant_value INTO type, value FROM service WHERE public.service.id=NEW.service_id;
    IF (type='PROVIDE'::service_types) THEN
        EXECUTE public.change_user_mygrant_balance(NEW.candidate_id, -value);
        RETURN NEW;
    ELSIF (type='REQUEST'::service_types) THEN
        RETURN NEW;
END IF;
RAISE EXCEPTION 'Invalid service type';
END;
$$;

CREATE FUNCTION public.get_crowdfunding_of_comment(comment_id integer) RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN (
        SELECT crowdfunding_id
        FROM public.comment
        WHERE comment.id = comment_id);
END;
$$;

CREATE FUNCTION public.get_service_of_comment(comment_id integer) RETURNS integer
LANGUAGE plpgsql
AS $$BEGIN
RETURN (
    SELECT service_id
    FROM public.comment
    WHERE comment.id = comment_id);
END;
$$;

CREATE FUNCTION public.get_service_type(service_id integer) RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN (
        SELECT service_type
        FROM public.service		
        WHERE service.id=service_id
        LIMIT 1
    );
END;
$$;

CREATE FUNCTION public.give_achievement_reward() RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE reward integer;
BEGIN
    reward := (SELECT exp_reward FROM public.achievement WHERE achievement.id = NEW.achievement_id);
    EXECUTE public.change_user_mygrant_balance(NEW.user_id, reward);
    RETURN NEW;
END;
$$;

CREATE FUNCTION public.make_crowdfunding_donation() RETURNS trigger
LANGUAGE plpgsql
AS $$BEGIN
EXECUTE public.change_user_mygrant_balance(NEW.donator_id, -NEW.amount);
EXECUTE public.collected_balance(NEW.crowdfunding_id, NEW.amount);
IF (crowdfunding_reached_goal(NEW.crowdfunding_id)) THEN
    UPDATE crowdfunding
    SET status='FINISHED'::public.crowdfunding_statuses
    WHERE id=NEW.crowdfunding_id;
END IF;
RETURN NEW;
END;
$$;

CREATE FUNCTION public.make_transfer_users() RETURNS trigger
LANGUAGE plpgsql
AS $$BEGIN
EXECUTE public.change_user_mygrant_balance(NEW.sender_id, -NEW.amount);
EXECUTE public.change_user_mygrant_balance(NEW.receiver_id, NEW.amount);
RETURN NEW;
END;
$$;

CREATE FUNCTION public.refund_on_delete_crowdfunding_donation() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    EXECUTE public.change_user_mygrant_balance(OLD.donator_id, OLD.amount);
    RETURN NEW;
END;
$$;

CREATE FUNCTION public.refund_on_delete_service_offer() RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
type service_types;
value integer;
BEGIN
    SELECT service_type, mygrant_value INTO type, value FROM public.service WHERE service.id=OLD.service_id;
    IF (type='PROVIDE'::service_types) THEN
        EXECUTE public.change_user_mygrant_balance(OLD.candidate_id, value);
        RETURN NEW;
    ELSIF (type='REQUEST'::service_types) THEN
        RETURN NEW;
END IF;
RAISE EXCEPTION 'Invalid service type';
END;
$$;

CREATE FUNCTION public.remove_friend_request() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM public.friend_request
    WHERE (sender_id=NEW.user1_id AND receiver_id=NEW.user2_id)
    OR (sender_id=NEW.user2_id AND receiver_id=NEW.user1_id);
    RETURN NEW;
END;
$$;

CREATE FUNCTION public.remove_service_on_create_instance() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE service
    SET deleted=true
    WHERE service.id=NEW.service_id
    AND service.repeatable=false;
    RETURN NEW;
END;
$$;

CREATE FUNCTION public.delete_service_offer() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.crowdfunding_id IS NOT NULL THEN
        DELETE FROM public.crowdfunding_offer
        WHERE crowdfunding_offer.crowdfunding_id=NEW.crowdfunding_id
        AND crowdfunding_offer.service_id=NEW.service_id;
    ELSIF NEW.partner_id IS NOT NULL THEN
        DELETE FROM public.service_offer
        WHERE service_offer.candidate_id=NEW.partner_id
        AND service_offer.service_id=NEW.service_id;
END IF;
RETURN NEW;
END;
$$;

CREATE FUNCTION public.service_pay() RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
receiver_id integer;
is_crowdfunding boolean;
value integer;
type service_types;
creator integer;
BEGIN
    IF (NEW.creator_rating IS NOT NULL
        AND NEW.partner_rating IS NOT NULL
        AND (OLD.creator_rating IS NULL OR OLD.partner_rating IS NULL)) THEN

        SELECT mygrant_value, service_type, creator_id INTO value, type, creator FROM public.service WHERE service.id=NEW.service_id;
        IF (type = 'PROVIDE' AND creator IS NOT NULL) THEN
            EXECUTE public.change_user_mygrant_balance(creator, value);
        ELSIF (type = 'REQUEST' AND NEW.partner_id IS NOT NULL) THEN
            EXECUTE public.change_user_mygrant_balance(NEW.partner_id, value);
END IF;

END IF;
RETURN NEW;
END;
$$;

CREATE FUNCTION public.set_comment_service() RETURNS trigger
LANGUAGE plpgsql
AS $$BEGIN
IF NEW.in_reply_to IS NOT NULL THEN
    NEW.service_id := public.get_service_of_comment(NEW.in_reply_to);
    NEW.crowdfunding_id := public.get_crowdfunding_of_comment(NEW.in_reply_to);
END IF;
RETURN NEW;
END;
$$;

CREATE FUNCTION public.set_initial_weekly_hours() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.weekly_hours_remaining := NEW.max_weekly_hours;
    RETURN NEW;
END;
$$;

CREATE FUNCTION public.update_edit_history() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.message != OLD.message THEN
        NEW.edit_history := array_append(NEW.edit_history, OLD.message);
END IF;
RETURN NEW;
END;
$$;	

-- /CREATE FUNCTIONS

-- CREATE CONSTRAINTS
ALTER TABLE public.achievement
ADD CONSTRAINT exp_reward_non_negative CHECK ((exp_reward >= 0));

ALTER TABLE public.comment
ADD CONSTRAINT cant_reply_to_self CHECK ((id <> in_reply_to));
ALTER TABLE public.comment
ADD CONSTRAINT comment_on_service_or_crowdfunding CHECK (((service_id IS NULL) <> (crowdfunding_id IS NULL)));
ALTER TABLE public.comment
ADD CONSTRAINT comment_same_service_as_reply CHECK (((in_reply_to IS NULL) OR ((in_reply_to IS NOT NULL) AND (service_id = public.get_service_of_comment(in_reply_to)) AND (crowdfunding_id = public.get_crowdfunding_of_comment(in_reply_to)))));

ALTER TABLE public.crowdfunding
ADD CONSTRAINT recruiting_balance_non_negative CHECK ((recruiting_balance >= 0));
ALTER TABLE public.crowdfunding
ADD CONSTRAINT collected_balance_non_negative CHECK ((collected_balance >= 0));

ALTER TABLE public.crowdfunding_donation
ADD CONSTRAINT amount_positive CHECK ((amount > 0));
ALTER TABLE public.crowdfunding_donation
ADD CONSTRAINT rating_from_0_to_3 CHECK (((rating >= 0) AND (rating <= 3)));

ALTER TABLE public.crowdfunding_offer
ADD CONSTRAINT can_only_offer_to_service_provides CHECK ((public.get_service_type(service_id) = 'PROVIDE'::text));
ALTER TABLE public.crowdfunding_offer
ADD CONSTRAINT cant_have_same_creator CHECK ((NOT public.check_if_same_creator(service_id, crowdfunding_id)));

ALTER TABLE public.donation
ADD CONSTRAINT amount_positive CHECK ((amount > 0));
ALTER TABLE public.donation
ADD CONSTRAINT can_only_donate_to_friends CHECK (public.check_if_users_friends(sender_id, receiver_id));
ALTER TABLE public.donation
ADD CONSTRAINT cant_donate_to_self CHECK ((sender_id <> receiver_id));

ALTER TABLE public.donation_request
ADD CONSTRAINT amount_positive CHECK ((amount > 0));
ALTER TABLE public.donation_request
ADD CONSTRAINT can_only_donate_to_friends CHECK (public.check_if_users_friends(sender_id, receiver_id));
ALTER TABLE public.donation_request
ADD CONSTRAINT cant_donate_to_self CHECK ((sender_id <> receiver_id));

ALTER TABLE public.friend
ADD CONSTRAINT cant_friend_self CHECK ((user1_id <> user2_id));

ALTER TABLE public.friend_request
ADD CONSTRAINT cant_already_be_friends CHECK ((NOT public.check_if_users_friends(sender_id, receiver_id)));
ALTER TABLE public.friend_request
ADD CONSTRAINT cant_friend_self CHECK ((sender_id <> receiver_id));

ALTER TABLE public.loan
ADD CONSTRAINT amount_positive CHECK ((amount > 0));
ALTER TABLE public.loan
ADD CONSTRAINT can_only_loan_to_friends CHECK (public.check_if_users_friends(sender_id, receiver_id));
ALTER TABLE public.loan
ADD CONSTRAINT cant_loan_to_self CHECK ((sender_id <> receiver_id));

ALTER TABLE public.loan_request
ADD CONSTRAINT amount_positive CHECK ((amount > 0));
ALTER TABLE public.loan_request
ADD CONSTRAINT can_only_loan_to_friends CHECK (public.check_if_users_friends(sender_id, receiver_id));
ALTER TABLE public.loan_request
ADD CONSTRAINT cant_loan_to_self CHECK ((sender_id <> receiver_id));

ALTER TABLE public.message
ADD CONSTRAINT cant_message_self CHECK ((sender_id <> receiver_id));

ALTER TABLE public.post
ADD CONSTRAINT check_in_reply_to_circular_references CHECK (public.check_in_reply_to_post(id, in_reply_to));

ALTER TABLE public.report
ADD CONSTRAINT can_only_report_one_element CHECK ((user_id IS NOT NULL)::integer + (service_id IS NOT NULL)::integer + (crowdfunding_id IS NOT NULL)::integer + (post_id IS NOT NULL)::integer + (comment_id IS NOT NULL)::integer = 1);

ALTER TABLE public.service
ADD CONSTRAINT can_only_be_created_by_user_xor_crowdfunding CHECK (((creator_id IS NULL) <> (crowdfunding_id IS NULL)));
ALTER TABLE public.service
ADD CONSTRAINT cant_be_repeatable_if_crowdfunding CHECK ((crowdfunding_id IS NOT NULL AND repeatable=FALSE) OR crowdfunding_id IS NULL);
ALTER TABLE public.service
ADD CONSTRAINT crowdfunding_cant_provide_service CHECK ((((crowdfunding_id IS NULL) AND (service_type = 'PROVIDE'::public.service_types)) OR (service_type = 'REQUEST'::public.service_types)));
ALTER TABLE public.service
ADD CONSTRAINT radius_non_negative CHECK ((acceptable_radius >= 0));
ALTER TABLE public.service
ADD CONSTRAINT value_positive CHECK ((mygrant_value > 0));

ALTER TABLE public.service_instance
ADD CONSTRAINT crowdfunding_cant_provide_service CHECK ((((public.get_service_type(service_id) = 'REQUEST'::text) AND (partner_id IS NOT NULL) AND (crowdfunding_id IS NULL)) OR ((public.get_service_type(service_id) = 'PROVIDE'::text))));
ALTER TABLE public.service_instance
ADD CONSTRAINT partner_xor_crowdfunding CHECK ((partner_id IS NULL) <> (crowdfunding_id IS NULL));
ALTER TABLE public.service_instance
ADD CONSTRAINT rating_between_0_and_3 CHECK (((creator_rating >= 0) AND (creator_rating <= 3) AND (partner_rating >= 0) AND (partner_rating <= 3)));
ALTER TABLE public.service_instance
ADD CONSTRAINT scheduled_after_creation_of_service CHECK ((date_scheduled > date_agreed));

ALTER TABLE public.service_offer
ADD CONSTRAINT cant_offer_on_own_service CHECK ((NOT public.check_if_service_creator(service_id, candidate_id)));

ALTER TABLE public.users
ADD CONSTRAINT experience_points_non_negative CHECK ((experience_points >= 0));
ALTER TABLE public.users
ADD CONSTRAINT last_transaction_after_account_creation CHECK ((date_joined <= date_last_transaction));
ALTER TABLE public.users
ADD CONSTRAINT level_positive CHECK ((level > 0));
ALTER TABLE public.users
ADD CONSTRAINT max_weekly_hours_non_negative CHECK ((max_weekly_hours >= 0));
ALTER TABLE public.users
ADD CONSTRAINT mygrant_balance_non_negative CHECK ((mygrant_balance >= 0));
-- /CREATE CONSTRAINTS

-- CREATE SERIALS
ALTER TABLE ONLY public.achievement ALTER COLUMN id SET DEFAULT nextval('public.achievement_id_seq'::regclass);
ALTER TABLE ONLY public.comment ALTER COLUMN id SET DEFAULT nextval('public.comment_id_seq'::regclass);
ALTER TABLE ONLY public.country ALTER COLUMN id SET DEFAULT nextval('public.country_id_seq'::regclass);
ALTER TABLE ONLY public.crowdfunding ALTER COLUMN id SET DEFAULT nextval('public.crowdfunding_id_seq'::regclass);
ALTER TABLE ONLY public.crowdfunding_donation ALTER COLUMN id SET DEFAULT nextval('public.crowdfunding_donation_id_seq'::regclass);
ALTER TABLE ONLY public.donation ALTER COLUMN id SET DEFAULT nextval('public.donation_id_seq'::regclass);
ALTER TABLE ONLY public.donation_request ALTER COLUMN id SET DEFAULT nextval('public.donation_request_id_seq'::regclass);
ALTER TABLE ONLY public.loan ALTER COLUMN id SET DEFAULT nextval('public.loan_id_seq'::regclass);
ALTER TABLE ONLY public.loan_request ALTER COLUMN id SET DEFAULT nextval('public.loan_request_id_seq'::regclass);
ALTER TABLE ONLY public.message ALTER COLUMN id SET DEFAULT nextval('public.message_id_seq'::regclass);
ALTER TABLE ONLY public.post ALTER COLUMN id SET DEFAULT nextval('public.post_id_seq'::regclass);
ALTER TABLE ONLY public.report ALTER COLUMN id SET DEFAULT nextval('public.report_id_seq'::regclass);
ALTER TABLE ONLY public.service ALTER COLUMN id SET DEFAULT nextval('public.service_id_seq'::regclass);
ALTER TABLE ONLY public.service_instance ALTER COLUMN id SET DEFAULT nextval('public.service_instance_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);
-- /CREATE SERIALS

-- SET SERIAL VALUES
SELECT pg_catalog.setval('public.achievement_id_seq', 1000, true);
SELECT pg_catalog.setval('public.comment_id_seq', 1000, true);
SELECT pg_catalog.setval('public.country_id_seq', 1000, true);
SELECT pg_catalog.setval('public.crowdfunding_donation_id_seq', 1000, true);
SELECT pg_catalog.setval('public.crowdfunding_id_seq', 1000, true);
SELECT pg_catalog.setval('public.donation_id_seq', 1000, true);
SELECT pg_catalog.setval('public.donation_request_id_seq', 1000, true);
SELECT pg_catalog.setval('public.loan_id_seq', 1000, true);
SELECT pg_catalog.setval('public.loan_request_id_seq', 1000, true);
SELECT pg_catalog.setval('public.message_id_seq', 1000, true);
SELECT pg_catalog.setval('public.post_id_seq', 1003, true);
SELECT pg_catalog.setval('public.report_id_seq', 1000, true);
SELECT pg_catalog.setval('public.service_id_seq', 1000, true);
SELECT pg_catalog.setval('public.service_instance_id_seq', 1000, true);
SELECT pg_catalog.setval('public.user_id_seq', 1000, true);
-- /SET SERIAL VALUES

-- CREATE PRIMARY KEYS
ALTER TABLE ONLY public.achievement ADD CONSTRAINT achievement_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.blocked ADD CONSTRAINT blocked_pkey PRIMARY KEY (blocker_id, target_id);
ALTER TABLE ONLY public.comment ADD CONSTRAINT comment_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.country ADD CONSTRAINT country_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.crowdfunding_donation ADD CONSTRAINT crowdfunding_donation_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.crowdfunding_image ADD CONSTRAINT crowdfunding_image_pkey PRIMARY KEY (crowdfunding_id, image_url);
ALTER TABLE ONLY public.crowdfunding_offer ADD CONSTRAINT crowdfunding_offer_pkey PRIMARY KEY (service_id, crowdfunding_id);
ALTER TABLE ONLY public.crowdfunding ADD CONSTRAINT crowdfunding_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.donation ADD CONSTRAINT donation_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.donation_request ADD CONSTRAINT donation_request_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.friend ADD CONSTRAINT friend_pkey PRIMARY KEY (user1_id, user2_id);
ALTER TABLE ONLY public.friend_request ADD CONSTRAINT friend_request_pkey PRIMARY KEY (sender_id, receiver_id);
ALTER TABLE ONLY public.like_post ADD CONSTRAINT like_post_pkey PRIMARY KEY (user_id, post_id);
ALTER TABLE ONLY public.loan ADD CONSTRAINT loan_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.loan_request ADD CONSTRAINT loan_request_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.message ADD CONSTRAINT message_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.portfolio ADD CONSTRAINT portfolio_pkey PRIMARY KEY (user_id, image_url);
ALTER TABLE ONLY public.post_image ADD CONSTRAINT post_image_pkey PRIMARY KEY (post_id, image_url);
ALTER TABLE ONLY public.post ADD CONSTRAINT post_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.report ADD CONSTRAINT report_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.service_image ADD CONSTRAINT service_image_pkey PRIMARY KEY (service_id, image_url);
ALTER TABLE ONLY public.service_instance ADD CONSTRAINT service_instance_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.service_offer ADD CONSTRAINT service_offer_pkey PRIMARY KEY (service_id, candidate_id);
ALTER TABLE ONLY public.service ADD CONSTRAINT service_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_achievement ADD CONSTRAINT user_achievement_pkey PRIMARY KEY (user_id, achievement_id);
ALTER TABLE ONLY public.users ADD CONSTRAINT user_pkey PRIMARY KEY (id);
-- /CREATE PRIMARY KEYS

-- CREATE UNIQUES
ALTER TABLE ONLY public.country ADD CONSTRAINT country_name_key UNIQUE(name);
ALTER TABLE ONLY public.country ADD CONSTRAINT country_code_key UNIQUE(code);
ALTER TABLE ONLY public.users ADD CONSTRAINT user_email_key UNIQUE (email);
ALTER TABLE ONLY public.users ADD CONSTRAINT user_phone_key UNIQUE (phone);
-- /CREATE UNIQUES

-- CREATE INDEXES
CREATE UNIQUE INDEX unique_friend_requests ON public.friend_request USING btree (LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id));
CREATE UNIQUE INDEX unique_friends ON public.friend USING btree (LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id));
-- /CREATE INDEXES

-- CREATE TRIGGERS
CREATE TRIGGER crowdfunding_finished AFTER UPDATE ON public.crowdfunding FOR EACH ROW EXECUTE PROCEDURE public.crowdfunding_finished();
CREATE TRIGGER check_crowdfunding_status_on_donation BEFORE INSERT ON public.crowdfunding_donation FOR EACH ROW EXECUTE PROCEDURE public.crowdfunding_check_status_donation();
CREATE TRIGGER check_crowdfunding_status_on_offer BEFORE INSERT ON public.crowdfunding_offer FOR EACH ROW EXECUTE PROCEDURE public.crowdfunding_check_status_offer();
CREATE TRIGGER check_crowdfunding_status_on_offer BEFORE INSERT ON public.service_offer FOR EACH ROW EXECUTE PROCEDURE public.crowdfunding_check_status_offer();
CREATE TRIGGER check_service_status_on_instance BEFORE INSERT ON public.service_instance FOR EACH ROW EXECUTE PROCEDURE public.service_check_status();
CREATE TRIGGER check_service_status_on_offer BEFORE INSERT ON public.service_offer FOR EACH ROW EXECUTE PROCEDURE public.service_check_status();
CREATE TRIGGER deduct_on_service_offer BEFORE INSERT ON public.service_offer FOR EACH ROW EXECUTE PROCEDURE public.deduct_on_service_offer();
CREATE TRIGGER delete_service_offer BEFORE INSERT ON public.service_instance FOR EACH ROW EXECUTE PROCEDURE public.delete_service_offer();
CREATE TRIGGER give_achievement_reward AFTER INSERT ON public.user_achievement FOR EACH ROW EXECUTE PROCEDURE public.give_achievement_reward();
CREATE TRIGGER make_transfer BEFORE INSERT ON public.donation FOR EACH ROW EXECUTE PROCEDURE public.make_transfer_users();
CREATE TRIGGER make_transfer BEFORE INSERT ON public.loan FOR EACH ROW EXECUTE PROCEDURE public.make_transfer_users();
CREATE TRIGGER make_crowdfunding_donation BEFORE INSERT ON public.crowdfunding_donation FOR EACH ROW EXECUTE PROCEDURE public.make_crowdfunding_donation();
CREATE TRIGGER refund_on_delete_crowdfunding_donation AFTER DELETE ON public.crowdfunding_donation FOR EACH ROW EXECUTE PROCEDURE public.refund_on_delete_crowdfunding_donation();
CREATE TRIGGER refund_on_delete_service_offer AFTER DELETE ON public.service_offer FOR EACH ROW EXECUTE PROCEDURE public.refund_on_delete_service_offer();
CREATE TRIGGER remove_friend_request AFTER INSERT OR UPDATE ON public.friend FOR EACH ROW EXECUTE PROCEDURE public.remove_friend_request();
CREATE TRIGGER remove_service_on_create_instance AFTER INSERT ON public.service_instance FOR EACH ROW EXECUTE PROCEDURE public.remove_service_on_create_instance();
CREATE TRIGGER service_pay AFTER UPDATE ON public.service_instance FOR EACH ROW EXECUTE PROCEDURE public.service_pay();
CREATE TRIGGER pay_on_service_instance BEFORE INSERT ON public.service_instance FOR EACH ROW EXECUTE PROCEDURE public.pay_on_service_instance();
CREATE TRIGGER set_comment_service BEFORE INSERT OR UPDATE ON public.comment FOR EACH ROW EXECUTE PROCEDURE public.set_comment_service();
CREATE TRIGGER set_initial_weekly_hours BEFORE INSERT ON public.users FOR EACH ROW EXECUTE PROCEDURE public.set_initial_weekly_hours();
CREATE TRIGGER update_edit_history BEFORE UPDATE ON public.comment FOR EACH ROW EXECUTE PROCEDURE public.update_edit_history();
CREATE TRIGGER update_edit_history BEFORE UPDATE ON public.POST FOR EACH ROW EXECUTE PROCEDURE public.update_edit_history();
-- /CREATE TRIGGERS

-- CREATE FOREIGN KEYS
ALTER TABLE ONLY public.blocked ADD CONSTRAINT blocked_blocker_id_fkey FOREIGN KEY (blocker_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.blocked ADD CONSTRAINT blocked_target_id_fkey FOREIGN KEY (target_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.comment ADD CONSTRAINT comment_crowdfunding_id_fkey FOREIGN KEY (crowdfunding_id) REFERENCES public.crowdfunding(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.comment ADD CONSTRAINT comment_in_reply_to_fkey FOREIGN KEY (in_reply_to) REFERENCES public.comment(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.comment ADD CONSTRAINT comment_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.comment ADD CONSTRAINT comment_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.service(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.crowdfunding ADD CONSTRAINT crowdfunding_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.crowdfunding_donation ADD CONSTRAINT crowdfunding_donation_crowdfunding_id_fkey FOREIGN KEY (crowdfunding_id) REFERENCES public.crowdfunding(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.crowdfunding_donation ADD CONSTRAINT crowdfunding_donation_donator_id_fkey FOREIGN KEY (donator_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.crowdfunding_image ADD CONSTRAINT crowdfunding_image_crowdfunding_id_fkey FOREIGN KEY (crowdfunding_id) REFERENCES public.crowdfunding(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.crowdfunding_offer ADD CONSTRAINT crowdfunding_offer_crowdfunding_id_fkey FOREIGN KEY (crowdfunding_id) REFERENCES public.crowdfunding(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.crowdfunding_offer ADD CONSTRAINT crowdfunding_offer_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.service(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.donation ADD CONSTRAINT donation_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.donation_request ADD CONSTRAINT donation_request_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.donation_request ADD CONSTRAINT donation_request_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.donation ADD CONSTRAINT donation_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.friend_request ADD CONSTRAINT friend_request_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.friend_request ADD CONSTRAINT friend_request_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.friend ADD CONSTRAINT friend_user1_id_fkey FOREIGN KEY (user1_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.friend ADD CONSTRAINT friend_user2_id_fkey FOREIGN KEY (user2_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.like_post ADD CONSTRAINT like_post_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.post(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.like_post ADD CONSTRAINT like_post_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.loan ADD CONSTRAINT loan_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.loan_request ADD CONSTRAINT loan_request_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.loan_request ADD CONSTRAINT loan_request_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.loan ADD CONSTRAINT loan_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.message ADD CONSTRAINT message_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.message ADD CONSTRAINT message_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.portfolio ADD CONSTRAINT portfolio_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.post_image ADD CONSTRAINT post_image_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.post(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.post ADD CONSTRAINT post_in_reply_to_fkey FOREIGN KEY (in_reply_to) REFERENCES public.post(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.post ADD CONSTRAINT post_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.report ADD CONSTRAINT report_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.comment(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.report ADD CONSTRAINT report_crowdfunding_id_fkey FOREIGN KEY (crowdfunding_id) REFERENCES public.crowdfunding(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.report ADD CONSTRAINT report_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.post(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.report ADD CONSTRAINT report_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.report ADD CONSTRAINT report_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.service(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.report ADD CONSTRAINT report_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.service ADD CONSTRAINT service_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.service ADD CONSTRAINT service_crowdfunding_id_fkey FOREIGN KEY (crowdfunding_id) REFERENCES public.crowdfunding(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.service_image ADD CONSTRAINT service_image_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.service(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.service_instance ADD CONSTRAINT service_instance_crowdfunding_id_fkey FOREIGN KEY (crowdfunding_id) REFERENCES public.crowdfunding(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.service_instance ADD CONSTRAINT service_instance_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.service_instance ADD CONSTRAINT service_instance_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.service(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.service_offer ADD CONSTRAINT service_offer_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.service_offer ADD CONSTRAINT service_offer_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.service(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_achievement ADD CONSTRAINT user_achievement_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievement(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_achievement ADD CONSTRAINT user_achievement_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.users ADD CONSTRAINT users_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.country(id) ON UPDATE CASCADE ON DELETE SET NULL;
-- /CREATE FOREIGN KEYS

-- CREATE VIEWS
CREATE VIEW rating AS
SELECT user_id, AVG(rating) AS value
FROM (
    SELECT service_instance.partner_id AS user_id, service_instance.creator_rating AS rating
    FROM service_instance
    WHERE service_instance.creator_rating IS NOT NULL AND service_instance.partner_id IS NOT NULL
    UNION ALL
    SELECT service.creator_id AS user_id, service_instance.partner_rating AS rating
    FROM service_instance
    JOIN service
    ON service_instance.service_id=service.id
    WHERE service_instance.partner_rating IS NOT NULL AND service.creator_id IS NOT NULL
    UNION ALL
    SELECT crowdfunding.creator_id AS user_id, service_instance.creator_rating AS rating
    FROM service_instance
    JOIN crowdfunding
    ON service_instance.crowdfunding_id=crowdfunding.id
    WHERE service_instance.creator_rating IS NOT NULL AND crowdfunding.creator_id IS NOT NULL
    UNION ALL
    SELECT crowdfunding.creator_id AS user_id, service_instance.partner_rating AS rating
    FROM service_instance
    JOIN service
    ON service_instance.service_id=service.id
    JOIN crowdfunding
    ON service.crowdfunding_id=crowdfunding.id
    WHERE service_instance.partner_rating IS NOT NULL AND crowdfunding.creator_id IS NOT NULL
    UNION ALL
    SELECT crowdfunding.creator_id AS user_id, crowdfunding_donation.rating AS rating
    FROM crowdfunding_donation
    JOIN crowdfunding
    ON crowdfunding_donation.crowdfunding_id=crowdfunding.id
    WHERE crowdfunding_donation.rating IS NOT NULL AND crowdfunding.creator_id IS NOT NULL) AS r
GROUP BY r.user_id
-- /CREATE VIEWS
