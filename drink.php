<?php
	session_start();
	
	$drinkid = $_GET["id"];
	
	if(isset($_SESSION['recent'])){
		$_SESSION['recent'][] = $drinkid;
	} else{
		$_SESSION['recent'] = array($drinkid);
	}
	
	$drink_name = "Unidentified Drink";
	$ingredients = array();
	$rating = 0;
	$instructions = "No instructions exist for this drink.";

	$con = mysql_connect("localhost","fat_charles_user","fat_charles");
	if (!$con){
		die("Could not connect: " . mysql_error());
	}

	mysql_select_db("fat_charles_db");
	
	$name_query = mysql_query("SELECT drink_name FROM ingredients WHERE id=$drinkid LIMIT 1");
	$row = mysql_fetch_array($name_query);
	if (isset($row["drink_name"])) {
		$drink_name = $row["drink_name"];
	}
	
	$ingredients_query = mysql_query("SELECT amount, ingredient FROM ingredients WHERE id=$drinkid");
	while ($row = mysql_fetch_array($ingredients_query)) {
		$ingredients[] = $row["amount"] . " " . $row["ingredient"];
	}
	
	$ratings_query = mysql_query("SELECT rating FROM ratings WHERE id=$drinkid");
	$row = mysql_fetch_array($ratings_query);
	if (isset($row["rating"])) {
		$rating = $row["rating"];
	}
	
	$instructions_query = mysql_query("SELECT instructions FROM instructions WHERE id=$drinkid");
	$row = mysql_fetch_array($instructions_query);
	if (isset($row["instructions"])) {
		$instructions = $row["instructions"];
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
	<div data-role="page" id="drinkPage">
		<script type="text/javascript">
			$(document).on("pageinit", function() {
				$("#drinkPage").data("drinkid", <?php echo $drinkid; ?>);
				$("#drinkPage").data("rating", <?php echo $rating; ?>);
			});
		</script>
			
			<div data-role="header">
			<a href="index.php" data-type="button" data-icon="arrow-l" data-rel="back">Back</a>
			<h1><?php echo $drink_name; ?></h1>
		</div>

		<div data-role="content">
			<div id="ratings">
				<h4 id="drinkRating"><?php echo $rating . " people like this drink" ?></h4>
				<div data-role="controlgroup">
					<input type="button" id="likeButton" value="Like this drink" />
				</div>
			</div>
			
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
			
			<div id="comments">
				<div id="commentHeaderDiv">
					<h3>Comments</h3>
					<a href="#" id="showHideComments">(Hide comments)</a>
				</div>
				<br />
				<div data-role="controlgroup">
					<input type="button" id="commentButton" value="Leave a comment" />
				</div>
				
				<div id="commentDiv">
					<?php
						$comments = array(
                                        array("user" => "user1234", "comment" => "OMG SO GOOOOOOOD!!", "time" => "Apr 15, 2012, 8:23pm"),
                                        array("user" => "coolkid34", "comment" => "dude, I hated that drink", "time" => "Apr 12, 2012, 2:23am"),
                                        array("user" => "whoami", "comment" => "yeah that was really good", "time" => "Jan 2, 2012, 1:08am"));

						if (isset($_SESSION["id"]) && isset($_POST["param"])) {
								if ($_POST["param"] == $_SESSION["id"]) {
										$thiscomment = array("user" => $_SESSION["user"], "comment" => $_SESSION["comment"], "time" => $_SESSION["time"]);
										array_unshift($comments, $thiscomment);
								}
						}
						
						foreach ($comments as $comment) {
							echo "<p>" . $comment["user"] . " (" . $comment["time"] . ")" . ": " . $comment["comment"] . "</p>";
						}
					
					?>

				
				</div>
			</div>
			
		</div><!-- /content -->

	</div><!-- /page -->
	<?php mysql_close($con); ?>
	</body>
</html>
