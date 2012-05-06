<?php

$con = mysql_connect("localhost","fat_charles_user","fat_charles");
if (!$con){
	die("Could not comment: " . mysql_error());
}

mysql_select_db("fat_charles_db");

for($i=1; $i <= 9770; $i++){
	$results = mysql_query("select count(*) from ingredients where id=$i;");
	list($count) = mysql_fetch_array($results);
	echo $i . "\t" . $count . "\n";
	if ($count == 0){
		mysql_query("delete from instructions where id=$i;");
	}
}

/*
$array = array();
$results = mysql_query("select id, drink_name from instructions;");
while(list($id,$drinkname) = mysql_fetch_array($results)){
	$array[$id] = $drinkname;
}

foreach($array as $id => $drinkname){
	mysql_query('update ingredients set id='.$id.' where drink_name="'.$drinkname.'";');
}
*/
mysql_close($con);

?>
