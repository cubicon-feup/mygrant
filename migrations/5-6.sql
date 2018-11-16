-- ALTER OLD TABLES
ALTER TABLE public.crowdfunding ADD latitude double precision, ADD longitude double precision;

-- CREATE TABLES
CREATE TABLE public.association (
	id serial,
	id_creator integer NOT NULL,
	ass_name text UNIQUE NOT NULL,
	missao text,
	criterios_entrada text,
	joia int,
	quota int,
	date_created timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.ass_admin (
	id_ass integer NOT NULL,
	id_admin integer NOT NULL,
	date_joined timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.ass_member (
	id_ass integer NOT NULL,
	id_member integer NOT NULL,
	date_joined timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.ass_invitation (
	id SERIAL,
	id_sender integer NOT NULL,
	id_receiver integer NOT NULL,
	accepted BOOLEAN DEFAULT FALSE NOT NULL,
	date_sent timestamp with time zone DEFAULT now() NOT NULL,
	date_accepted timestamp with time zone
);

-- CHECKS
ALTER TABLE ONLY public.association 
	ADD CONSTRAINT joia_ck CHECK (joia > 0);
ALTER TABLE ONLY public.association 
	ADD CONSTRAINT quota_ck CHECK (quota > 0);

-- PRIVATE KEYS
ALTER TABLE ONLY public.association 
	ADD CONSTRAINT association_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.ass_admin
	ADD CONSTRAINT ass_admin_key PRIMARY KEY (id_ass);
ALTER TABLE ONLY public.ass_member
	ADD CONSTRAINT ass_member_key PRIMARY KEY (id_ass);

-- FOREIGN KEYS
ALTER TABLE ONLY public.ass_admin
	ADD CONSTRAINT ass_admins_id_fkey FOREIGN KEY (id_admin) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.ass_member
	ADD CONSTRAINT ass_member_id_fkey FOREIGN KEY (id_member) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;

-- TRIGGER PROCEDURES
CREATE FUNCTION adminYourAassociation() RETURNS TRIGGER AS $adminYourAassociation$
	BEGIN
		IF EXISTS (SELECT * FROM public.ass_admin WHERE NEW.id = id_ass AND NEW.id_creator = id_admin) THEN
			RAISE INFO 'I am already an admin of this Association';
		ELSE
			INSERT INTO public.ass_admin (id_ass,id_admin) VALUES (NEW.id, NEW.id_creator);
		END IF;
		RETURN NEW;
	END;
$adminYourAassociation$ LANGUAGE plpgsql;

CREATE TRIGGER adminYourAassociation
	AFTER INSERT ON public.association
		FOR EACH ROW
			EXECUTE PROCEDURE adminYourAassociation();

CREATE FUNCTION acceptAssociationInvite() RETURNS TRIGGER AS $acceptAssociationInvite$
	BEGIN
		IF EXISTS (SELECT * FROM public.ass_member WHERE NEW.id_ass = id_ass AND NEW.id_member = id_member) THEN
			RAISE INFO 'I am already an member of this Association';
		ELSE
			INSERT INTO public.ass_member (id_ass,id_member) VALUES (NEW.id_ass, NEW.id_member);
		END IF;
		RETURN NEW;
	END;
$acceptAssociationInvite$ LANGUAGE plpgsql;

CREATE TRIGGER acceptAssociationInvite
	AFTER UPDATE OF accepted ON public.ass_invitation
		FOR EACH ROW
			EXECUTE PROCEDURE acceptAssociationInvite();

-- INSERTS
INSERT INTO  public.association(id_creator,ass_name) VALUES (1001, 'ass');