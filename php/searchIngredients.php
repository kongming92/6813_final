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

$result = array();
foreach($answer as $drinkname){
	$results = mysql_query('select id from instructions where drink_name = "'.$drinkname.'";');
	list($id) = mysql_fetch_array($results);
	$results = mysql_query('select rating from ratings where id = "'.$id.'";');
	list($rating) = mysql_fetch_array($results);
	$result[] = json_encode(array("id" => $id, "name" => $drinkname, "rating" => $rating));
}

echo json_encode($result);

mysql_close($con);

?>
