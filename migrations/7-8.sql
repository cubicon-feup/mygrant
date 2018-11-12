CREATE TABLE public.polls (
	id integer NOT NULL,
	id_creator integer NOT NULL,
	question text NOT NULL,
    free_text boolean NOT NULL,
	options text
);
CREATE SEQUENCE public.poll_id_seq
	START WITH 1
	INCREMENT BY 1
	NO MINVALUE
	NO MAXVALUE
	CACHE 1;
ALTER SEQUENCE public.poll_id_seq OWNED BY public.polls.id;


CREATE TABLE public.polls_answers (
	id_poll integer NOT NULL,
	id_user integer NOT NULL,
	answer text NOT NULL
);


ALTER TABLE ONLY public.polls ALTER COLUMN id SET DEFAULT nextval('public.polls_answers'::regclass);
ALTER TABLE ONLY public.polls ADD CONSTRAINT polls_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.polls ADD CONSTRAINT polls_creator_id_fkey FOREIGN KEY (id_creator) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


ALTER TABLE ONLY public.polls_answers ADD CONSTRAINT polls_answers_pkey PRIMARY KEY (id_poll, id_user);
ALTER TABLE ONLY public.polls_answers ADD CONSTRAINT polls_answers_user_id_fkey FOREIGN KEY (id_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.polls_answers ADD CONSTRAINT polls_answers_poll_id_fkey FOREIGN KEY (id_poll) REFERENCES public.polls(id) ON UPDATE CASCADE ON DELETE CASCADE;