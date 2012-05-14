
<?php
	$name = $_POST["name"];
	$ingredients = $_POST["ingredients"];
	$amounts = $_POST["amounts"];
	$instructions = $_POST["instructions"];
	$con = mysql_connect("localhost", "fat_charles_user", "fat_charles");
	mysql_select_db("fat_charles_db");
	
	$instructions_query = mysql_query("INSERT INTO instructions (drink_name, instructions) VALUES ('$name', '$instructions')");
	$getid = mysql_query("SELECT id FROM instructions WHERE drink_name='$name' AND instructions='$instructions'");
	$number = mysql_fetch_assoc($getid);
	$id = $number["id"];
	foreach ($ingredients as $key => $ingredient) {
		mysql_query("INSERT INTO ingredients VALUES ($id, '$name', '$ingredient', '$amounts[$key]')");
	}
	echo json_encode(array("id" => $id));
?>