INSERT INTO post(sender_id, message, in_reply_to)
VALUES ($(user_id), $(message), $(replied_post_id))