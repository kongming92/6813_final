<?php
	session_start();
	if(isset($_POST["id"]) && isset($_POST["user"]) && isset($_POST["comment"])) {
		exec('echo "hello" > log');
		$_SESSION["id"] = $_POST["id"];
		$_SESSION["user"] = $_POST["user"];
		$_SESSION["comment"] = $_POST["comment"];
		$_SESSION["time"] = "just now";
	}
	
?>