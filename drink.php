<?php
	session_start();
	
	$drinkid = $_GET["id"];
	
	//$_SESSION['recent'] = array(3,2);
	if(isset($_SESSION['recent'])){
		$_SESSION['recent'][] = $drinkid;
	}
	else{
		$_SESSION['recent'] = array($drinkid);
	}
		
	$name = array(1 => "MartiniX", "Cranberry Delight", "Fat Charles Special");
	$ratings = array(1=> 34, 17, -3);
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
		<script type="text/javascript">
			$(document).on("pageinit", function() {
				$("#drinkPage").data("drinkid", <?php echo $drinkid; ?>);
				$("#drinkPage").data("rating", <?php echo $ratings[$drinkid]; ?>);
			});
		</script>
			
			<div data-role="header">
			<a href="index.php" data-type="button" data-icon="arrow-l" data-rel="back">Back</a>
			<h1><?php echo $name[$drinkid]; ?></h1>
		</div>

		<div data-role="content">
			<div id="ratings">
				<h4 id="drinkRating"><?php echo $ratings[$drinkid] . " people like this drink" ?></h4>
				<input type="button" id="likeButton" value="Like this drink" />

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
				<div data-role="controlgroup"><?php echo '<a href="php/commentForm.php?id=' . $drinkid . '&name=' . $name[$drinkid] . '" data-role="button">Add a Comment</a>'; ?></div>
				<div id="commentHeaderDiv">
					<h3>Comments</h3>
				</div>
				<div id="showHideCommentsDiv">
					<a href="#" id="showHideComments">(Hide comments)</a>
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
							echo "<p>" . $comment["user"] . " (" . $comment["comment"] . ")" . ": " . $comment["time"] . "</p>";
						}
					
					?>

				
				</div>
			</div>
			
		</div><!-- /content -->

	</div><!-- /page -->
	</body>
</html>
