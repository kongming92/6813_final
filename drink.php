<?php
	$drinkid = $_GET["id"];
	$name = array(1 => "MartiniX", "Cranberry Delight", "Fat Charles Special");
	$ingredients = array("3 shots vodka", "4 oz. cranberry juice", "1 oz. pineapple juice");
	$instructions = "Pour the vodka over ice in a cup, followed by cranberry juice. Add pineapple juice slowly, to taste.";
	
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
	<div data-role="page" id="drinkPage">
		<div data-role="header">
			<h1><?php echo $name[$drinkid]; ?></h1>
		</div>

		<div data-role="content">
		
			<div id="ingredients">
				<h3>Ingredients</h3>
				<ul>
				<?php
					foreach ($ingredients as $i) {
						echo "<li>" . $i . "</li>";
					}
				?>
				</ul>
			</div>
			<div id="instructions">
				<h3>Instructions</h3>
				<p><?php echo $instructions; ?></p>
			</div>
		</div><!-- /content -->

	</div><!-- /page -->
	</body>
</html>
