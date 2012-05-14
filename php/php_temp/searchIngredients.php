<?php

$con = mysql_connect("localhost","fat_charles_user","fat_charles");
if (!$con){
	die("Could not connect: " . mysql_error());
}

mysql_select_db("fat_charles_db");


$array = array();
$ing = array();
$ingredients = array("Orange Juice", "Rum", "Vodka", "Schnapps");
foreach($ingredients as $ingredient){
	$results = mysql_query('select count(*) from ingredients where ingredient = "'.$ingredient.'";');
	list($count) = mysql_fetch_array($results);
	$ing[$ingredient] = $count;
}

arsort($ing);
$ingredients = array_keys($ing);

foreach($ingredients as $ingredient){
	$temp = array();
	$results = mysql_query('select drink_name from ingredients where ingredient = "'.$ingredient.'";');
	while(list($drinkname) = mysql_fetch_array($results)){
		$temp[] = $drinkname;
	}
	$array[] = $temp;
}

$answer = array();
while(count($answer) < 40 && count($array) > 0){
	$t = $array[0];
	foreach($array as $temp){
		$t = array_intersect($t,$temp);
	}
	$answer = array_unique(array_merge($answer,$t));
	array_pop($array);
}

print_r($answer);

//$result[] = json_encode(array("id" => $id, "name" => $drinkname, "rating" => $rating));

mysql_close($con);

?>
