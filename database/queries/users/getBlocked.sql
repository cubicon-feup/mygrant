SELECT users.id, users.full_name, image.filename AS image_path, users.verified
FROM users
JOIN blocked
ON users.id=blocked.target_id
LEFT JOIN image
ON users.image_id=image.id
WHERE blocked.blocker_id=$(user_id)