<?php

	$con = mysql_connect("localhost", "fat_charles_user", "fat_charles") or die(mysql_error());
	mysql_select_db("fat_charles_db");
	
	$drinkid = $_POST["id"];
	$rating = 100;
	$ratings_query = mysql_query("SELECT rating FROM ratings WHERE id=$drinkid");
	$row = mysql_fetch_assoc($ratings_query);
	echo json_encode($row);
	/*
	if (isset($row["rating"])) {
		$rating = $row["rating"];
	}
	
	echo json_encode(array("id" => $drinkid, "rating" => $rating));
	*/
	mysql_close($con);
?>