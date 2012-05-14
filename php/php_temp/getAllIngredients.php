<?php

	$con = mysql_connect("localhost", "fat_charles_user", "fat_charles");
	mysql_select_db("fat_charles_db");
	$query = mysql_query("SELECT DISTINCT nickname FROM categories ORDER BY nickname");
	$results = array();
	while ($row = mysql_fetch_assoc($query)) {
		$results[] = $row["nickname"];
	}
	echo json_encode($results);
?>
