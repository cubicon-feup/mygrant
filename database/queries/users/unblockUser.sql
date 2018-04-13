DELETE FROM blocked
WHERE blocker_id=$(blocker_id) AND target_id=$(target_id)