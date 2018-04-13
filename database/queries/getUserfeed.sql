SELECT post.id AS post_id, message AS post_message, date_posted AS post_date_posted, in_reply_to AS post_in_reply_to, COUNT(like_post.user_id) AS post_n_likes, COUNT(post_image.image_id) AS post_n_images, MIN(post_image_image.filename) AS post_image, array_length(post.edit_history, 1) AS post_n_edits, post.sender_id AS sender_id, users.full_name AS sender_full_name, user_image.filename AS sender_image_url
FROM post
JOIN users
ON post.sender_id=users.id
LEFT JOIN image user_image
ON users.image_id=user_image.id
LEFT JOIN like_post
ON post.id=like_post.post_id
LEFT JOIN post_image
ON post.id=post_image.post_id
LEFT JOIN image post_image_image
ON post_image.image_id=post_image_image.id
WHERE post.sender_id=$(user_id)
GROUP BY post.id, users.full_name, user_image.filename
ORDER BY date_posted DESC