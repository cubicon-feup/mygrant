SELECT post.id AS post_id, message, date_posted, in_reply_to, post.sender_id AS sender_id, full_name, image.filename AS image_path
FROM post
JOIN (
	SELECT user1_id AS user_id
	FROM friend
	WHERE user2_id=${user_id}
	UNION ALL
	SELECT user2_id
	FROM friend
	WHERE user1_id=${user_id}
) AS friends
ON post.sender_id=friends.user_id
JOIN users
ON friends.user_id=users.id
LEFT JOIN image
ON users.image_id=image.id
ORDER BY date_posted DESC