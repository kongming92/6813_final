<?php

	$drinkid = $_POST["id"];
	$param = $_POST["param"];
	$con = mysql_connect("localhost", "fat_charles_user", "fat_charles");
	mysql_select_db("fat_charles_db");
	
	if ($param == "incr") {
		mysql_query("UPDATE ratings SET rating = rating+1 WHERE id=$drinkid");
	} else if ($param == "decr") {
		mysql_query("UPDATE ratings SET rating = rating-1 WHERE id=$drinkid");
	}
?>