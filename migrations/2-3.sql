
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
CREATE TRIGGER check_crowdfunding_status_on_donation BEFORE INSERT ON public.crowdfunding_donation FOR EACH ROW EXECUTE PROCEDURE public.crowdfunding_check_status_donation();
CREATE TRIGGER check_crowdfunding_status_on_offer BEFORE INSERT ON public.crowdfunding_offer FOR EACH ROW EXECUTE PROCEDURE public.crowdfunding_check_status_offer();
CREATE TRIGGER check_crowdfunding_status_on_offer BEFORE INSERT ON public.service_offer FOR EACH ROW EXECUTE PROCEDURE public.crowdfunding_check_status_offer();
CREATE TRIGGER crowdfunding_stop_collecting AFTER UPDATE ON public.crowdfunding FOR EACH ROW EXECUTE PROCEDURE public.crowdfunding_stop_collecting();
CREATE TRIGGER deduct_on_crowdfunding_offer BEFORE INSERT ON public.crowdfunding_offer FOR EACH ROW EXECUTE PROCEDURE public.deduct_on_crowdfunding_offer();
CREATE TRIGGER deduct_on_service_offer BEFORE INSERT ON public.service_offer FOR EACH ROW EXECUTE PROCEDURE public.deduct_on_service_offer();
CREATE TRIGGER delete_service_offer BEFORE INSERT ON public.service_instance FOR EACH ROW EXECUTE PROCEDURE public.delete_service_offer();
CREATE TRIGGER give_achievement_reward AFTER INSERT ON public.user_achievement FOR EACH ROW EXECUTE PROCEDURE public.give_achievement_reward();
CREATE TRIGGER make_transfer BEFORE INSERT ON public.donation FOR EACH ROW EXECUTE PROCEDURE public.make_transfer_users();
CREATE TRIGGER make_transfer BEFORE INSERT ON public.loan FOR EACH ROW EXECUTE PROCEDURE public.make_transfer_users();
CREATE TRIGGER make_transfer_crowdfunding BEFORE INSERT ON public.crowdfunding_donation FOR EACH ROW EXECUTE PROCEDURE public.make_transfer_crowdfunding();
CREATE TRIGGER refund_on_delete_crowdfunding AFTER UPDATE OF deleted OR DELETE ON public.crowdfunding FOR EACH ROW EXECUTE PROCEDURE public.refund_on_delete_crowdfunding();
CREATE TRIGGER refund_on_delete_crowdfunding_donation AFTER DELETE ON public.crowdfunding_donation FOR EACH ROW EXECUTE PROCEDURE public.refund_on_delete_crowdfunding_donation();
CREATE TRIGGER refund_on_delete_crowdfunding_offer AFTER DELETE ON public.crowdfunding_offer FOR EACH ROW EXECUTE PROCEDURE public.refund_on_delete_crowdfunding_offer();
CREATE TRIGGER refund_on_delete_service_offer AFTER DELETE ON public.service_offer FOR EACH ROW EXECUTE PROCEDURE public.refund_on_delete_service_offer();
CREATE TRIGGER remove_friend_request AFTER INSERT OR UPDATE ON public.friend FOR EACH ROW EXECUTE PROCEDURE public.remove_friend_request();
CREATE TRIGGER remove_service_on_create_instance AFTER INSERT ON public.service_instance FOR EACH ROW EXECUTE PROCEDURE public.remove_service_on_create_instance();
CREATE TRIGGER remove_service_offer_on_delete_service AFTER UPDATE ON public.service FOR EACH ROW EXECUTE PROCEDURE public.remove_service_offer_on_delete_service();
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
