
<?php

	$name = $_POST["param"];
	
	// arrays id => drink name
	$results = array("1" => json_encode(array("name" => "MartiniX", "rating" => "+34")), 
					"2" => json_encode(array("name" => "Cranberry Delight", "rating" => "+17")), 
					"3" => json_encode(array("name" => "Fat Charles Special", "rating" => "-3")));
	echo json_encode($results);
?>