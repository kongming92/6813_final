<?php

	$con = mysql_connect("localhost", "fat_charles_user", "fat_charles") or die(mysql_error());
	mysql_select_db("fat_charles");
	
	$drinkid = $_POST["id"];
	$rating = 0;
	$ratings_query = mysql_query("SELECT rating FROM ratings WHERE id=$drinkid");
	$row = mysql_fetch_assoc($ratings_query);
	if (isset($row["rating"])) {
		$rating = $row["rating"];
	}
	
	echo json_encode(array("rating" => $rating));

?>