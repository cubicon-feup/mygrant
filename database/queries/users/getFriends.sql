SELECT users.id, users.full_name, image.filename AS image_path, users.verified
FROM users
JOIN (
	SELECT user1_id AS user_id
	FROM friend
	WHERE user2_id=$(user_id)
	UNION ALL
	SELECT user2_id
	FROM friend
	WHERE user1_id=$(user_id)
) AS friends
ON users.id=friends.user_id
LEFT JOIN image
ON users.image_id=image.id