UPDATE post
SET edit_history=array_append(edit_history, message), message=$(message)
WHERE id=$(post_id) AND sender_id=$(user_id)