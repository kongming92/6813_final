<?php

$con = mysql_connect("localhost", "fat_charles_user", "fat_charles");
mysql_select_db("fat_charles_db");

$id_array = $_POST["id"];

foreach ($id_array as $thisid) {
	$recent_query = mysql_query("SELECT ingredients.drink_name, ratings.rating FROM ingredients INNER JOIN ratings USING(id) WHERE ingredients.id=$thisid LIMIT 1");
	$row = mysql_fetch_assoc($recent_query);
	if (isset($row["drink_name"])) {
		$this_rating = 0;
		if (isset($row["rating"])) {
			$this_rating = $row["rating"];
		}
		$results[] = json_encode(array("id" => $thisid, "name" => $row["drink_name"], "rating" => $this_rating));
	}
}
mysql_close($con);
echo json_encode($results);

?>	

