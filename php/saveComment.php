<?php

$con = mysql_connect("localhost","fat_charles_user","fat_charles");
if (!$con){
        die("Could not connect: " .mysql_error());
}

mysql_select_db("fat_charles_db",$con);


$drinkname = $_POST["name"];
$username = $_POST["nameInputField"];
$comment = $_POST["commentTextArea"];
$time = $_POST["time"];

mysql_query("insert into comments values ('$drinkname','$username','$comment',$time);");


mysql_close($con);

?>
