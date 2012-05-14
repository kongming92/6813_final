<?php

$con = mysql_connect("localhost","fat_charles_user","fat_charles");
if (!$con){
	die("Could not connect: " . mysql_error());
}

mysql_select_db("fat_charles_db");


$results = mysql_query("select name, nickname from categories;");
while(list($name,$nickname) = mysql_fetch_array($results)){
	mysql_query('update ingredients set ingredient = "'.$nickname.'" where ingredient = "'.$name.'";');
}


mysql_close($con);

?>
