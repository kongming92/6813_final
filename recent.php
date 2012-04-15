<?php

session_start();
$id_array = $_SESSION['recent'];
$id_array = array_unique(array_reverse($id_array));

$name = array(1 => "MartiniX", "Cranberry Delight", "Fat Charles Special");
$ratings = array(1 => "+34", "+17", "-3");
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
			<a href="#" data-type="button" data-icon="arrow-l" data-rel="back">Home</a><h1>Recently Viewed Drinks</h1>
		</div>

		<div data-role="content">
		<ul data-role="listview" data-inset="true" id="resultsList">

<?php

foreach($id_array as $id){
	$drink = $name[$id];
	$rating = $ratings[$id];
	echo "<li><a href='drink.php?id=$id' >$drink<span class='ui-li-count'>$rating</span></a></li>";
}
?>

		</ul>
		</div><!-- /content -->

	</div><!-- /page -->
	</body>
</html>
