DELETE FROM friend
WHERE (user1_id=$(user1_id) AND user2_id=$(user2_id))
	OR (user1_id=$(user2_id) AND user2_id=$(user1_id))