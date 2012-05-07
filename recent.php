<?php

session_start();
$id_array = $_SESSION['recent'];
$id_array = array_unique(array_reverse($id_array));
$con = mysql_connect("localhost", "fat_charles_user", "fat_charles");
mysql_select_db("fat_charles_db");

$results = array();

foreach ($id_array as $thisid) {
	$recent_query = mysql_query("SELECT ingredients.drink_name, ratings.rating FROM ingredients INNER JOIN ratings USING(id) WHERE ingredients.id=$thisid LIMIT 1");
	$row = mysql_fetch_assoc($recent_query);
	if (isset($row["drink_name"])) {
		$this_rating = 0;
		if (isset($row["rating"])) {
			$this_rating = $row["rating"];
		}
		$results[] = array("id" => $thisid, "name" => $row["drink_name"], "rating" => $this_rating);
	}
}

?>	

<!doctype html>
<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1"> 

		<link rel="stylesheet" type="text/css" href="./css/jquery.mobile-1.1.0.css" />
		<link rel="stylesheet" type="text/css" href="./css/index.css" />
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
		<script type="text/javascript" src="./js/jquery.mobile-1.1.0.js"></script>
		<script type="text/javascript" src="./js/index.js" ></script>

	</head>
	<body>
	<div data-role="page" id="homePage">
		<div data-role="header">
			<a href="index.html" data-type="button" data-icon="arrow-l">Home</a><h1>Recently Viewed Drinks</h1>
		</div>

		<div data-role="content">
		<ul data-role="listview" data-inset="true" id="resultsList">

<?php
$id_array = array(1,2,3);
foreach($results as $result){
	$id = $result["id"];
	$name = $result["name"];
	$rating = $result["rating"];
	echo "<li><a href='drink.php?id=$id' data-ajax='false'>$name<span class='ui-li-count'>$rating likes</span></a></li>";
}

mysql_close($con);

?>

		</ul>
		</div><!-- /content -->

	</div><!-- /page -->
	</body>
</html>
