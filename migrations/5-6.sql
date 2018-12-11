-- ALTER OLD TABLES
ALTER TABLE public.crowdfunding ADD latitude double precision, ADD longitude double precision;

-- CREATE TABLES
CREATE TABLE public.association (
	id SERIAL,
	id_creator integer NOT NULL,
	ass_name text UNIQUE NOT NULL,
	missao text,
	criterios_entrada text,
	joia int,
	quota int,
	date_created timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.ass_admin (
	id SERIAL,
	id_ass integer NOT NULL,
	id_admin integer NOT NULL,
	date_joined timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.ass_treasurer (
	id SERIAL,
	id_ass integer NOT NULL,
	id_treasurer integer NOT NULL,
	date_joined timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.ass_member (
	id SERIAL,
	id_ass integer NOT NULL,
	id_member integer NOT NULL,
	member_position text DEFAULT 'Member' NOT NULL,
	date_joined timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.ass_invitation (
	id SERIAL,
	id_ass integer NOT NULL,
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
	ADD CONSTRAINT ass_admin_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.ass_treasurer
	ADD CONSTRAINT ass_treasurer_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.ass_member
	ADD CONSTRAINT ass_member_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.ass_invitation
	ADD CONSTRAINT ass_invitation_pkey PRIMARY KEY (id);

-- FOREIGN KEYS
ALTER TABLE ONLY public.association
	ADD CONSTRAINT association_id_creator_fkey FOREIGN KEY (id_creator) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.ass_admin
	ADD CONSTRAINT ass_admins_id_ass_fkey FOREIGN KEY (id_ass) REFERENCES public.association(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.ass_admin
	ADD CONSTRAINT ass_admins_id_admin_fkey FOREIGN KEY (id_admin) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.ass_treasurer
	ADD CONSTRAINT ass_treasurer_id_ass_fkey FOREIGN KEY (id_ass) REFERENCES public.association(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.ass_treasurer
	ADD CONSTRAINT ass_treasurer_id_treasurer_fkey FOREIGN KEY (id_treasurer) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.ass_member
	ADD CONSTRAINT ass_member_id_ass_fkey FOREIGN KEY (id_ass) REFERENCES public.association(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.ass_member
	ADD CONSTRAINT ass_member_id_fkey FOREIGN KEY (id_member) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.ass_invitation
	ADD CONSTRAINT ass_invitation_id_ass_fkey FOREIGN KEY (id_ass) REFERENCES public.association(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.ass_invitation
	ADD CONSTRAINT ass_invitation_id_sender_fkey FOREIGN KEY (id_sender) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.ass_invitation
	ADD CONSTRAINT ass_invitation_id_receiver_fkey FOREIGN KEY (id_receiver) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;

-- TRIGGER PROCEDURES
CREATE FUNCTION adminYourAssociation() RETURNS TRIGGER AS $adminYourAssociation$
	BEGIN
		--IF EXISTS (SELECT * FROM public.ass_admin WHERE id_ass = NEW.id_ass AND id_admin = NEW.id_creator) THEN
		--	RAISE INFO 'I am already an admin of this Association';
		--ELSE
			INSERT INTO public.ass_admin (id_ass,id_admin) VALUES (NEW.id_ass, NEW.id_creator);
		--END IF;
		RETURN NEW;
	END;
$adminYourAssociation$ LANGUAGE plpgsql;

CREATE TRIGGER adminYourAssociation
	AFTER INSERT ON public.association
		FOR EACH ROW
			EXECUTE PROCEDURE adminYourAssociation();

CREATE FUNCTION acceptAssociationInvite() RETURNS TRIGGER AS $acceptAssociationInvite$
	BEGIN
		--IF EXISTS (SELECT * FROM public.ass_member WHERE OLD.id_ass = id_ass AND OLD.id_sender = id_member) THEN
		--	RAISE INFO 'I am already an member of this Association';
		--ELSE
			INSERT INTO public.ass_member (id_ass,id_member) VALUES (OLD.id_ass, OLD.id_sender);
		--END IF;
		RETURN NEW;
	END;
$acceptAssociationInvite$ LANGUAGE plpgsql;

CREATE TRIGGER acceptAssociationInvite
	AFTER UPDATE OF accepted ON public.ass_invitation
		FOR EACH ROW
			EXECUTE PROCEDURE acceptAssociationInvite();

-- INSERTS
--INSERT INTO public.association(id_creator,ass_name) VALUES (1001, 'ass');
--INSERT INTO public.ass_invitation(id_ass,id_sender,id_receiver) VALUES (1, 1001, 1001);
--UPDATE public.ass_invitation SET accepted = true WHERE id = 1;