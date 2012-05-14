<?php

$con = mysql_connect("localhost","fat_charles_user","fat_charles");
if (!$con){
        die("Could not connect: " .mysql_error());
}

mysql_select_db("fat_charles_db",$con);


$id  = $_POST["id"];
$username = $_POST["nameInputField"];
$comment = $_POST["commentTextArea"];
//$time = $_POST["time"];

mysql_query("insert into comments values ('$id','$username','$comment',NOW());");


mysql_close($con);

?>
