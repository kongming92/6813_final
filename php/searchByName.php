
<?php

	$name = $_POST["param"];
	
	// arrays id => drink name
	$results = array("1" => "MartiniX", "2" => "Cranberry Delight", "3" => "Fat Charles Special");
	echo json_encode($results);
?>