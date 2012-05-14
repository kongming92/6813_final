<?php

$search = $_POST["param"];

$con = mysql_connect("localhost","fat_charles_user","fat_charles");
if (!$con){
	die("Could not connect: " . mysql_error());
}

mysql_select_db("fat_charles_db");


$result = array();
$results = mysql_query("select instructions.id, instructions.drink_name, ratings.rating from instructions, ratings where instructions.id = ratings.id and instructions.drink_name like '%$search%' order by ratings.rating desc LIMIT 100");
while(list($id,$drinkname,$rating) = mysql_fetch_array($results)){
	$result[] = json_encode(array("id" => $id, "name" => $drinkname, "rating" => $rating));
}

echo json_encode($result);
mysql_close($con);
?>
