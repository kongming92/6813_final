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
	
	$comments_query = mysql_query("SELECT username, comment, time FROM comments WHERE id=$drinkid ORDER BY time DESC");
	$comment = mysql_fetch_assoc($comments_query);
	$comments = array("<p>There are no comments at this time.</p>");
	if (isset($comment["username"]) && isset($comment["time"]) && isset($comment["comment"])) {
		$comments = array();
		$thisCommentStr = "<p>" . $comment["username"] . " (" . $comment["time"] . ")" . ": " . $comment["comment"] . "</p>";
		$comments[] = $thisCommentStr;
		while ($comment = mysql_fetch_assoc($comments_query)) {
			$thisCommentStr = "<p>" . $comment["username"] . " (" . $comment["time"] . ")" . ": " . $comment["comment"] . "</p>";
			$comments[] = $thisCommentStr;
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
	<div data-role="page" id="drinkPage">
		<script type="text/javascript">
			$("#drinkPage").data("drinkid", <?php echo $drinkid; ?>);
			$("#drinkPage").data("rating", <?php echo $rating; ?>);
			console.log("INT DONE");
		</script>
		<div data-role="header">
			<a href="index.php" data-type="button" data-icon="arrow-l" data-rel="back">Back</a>
			<h1><?php echo $drink_name; ?></h1>
		</div>

		<div data-role="content">
			<div id="ratings">
				<h4 id="drinkRating"><?php echo $rating . " people like this drink." ?></h4>
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
					<a href="#commentPage" data-role="button" id="commentFormButton" data-rel="dialog" data-transition="pop">Leave a comment</a>
				</div>
				
				<div id="commentDiv">
					<?php
						foreach ($comments as $comment) {
							echo $comment;
						}
					?>
					
				</div>
			</div>
			
		</div><!-- /content -->

	</div><!-- /page -->
	
	<div data-role="page" id="commentPage">
	
		<div data-role="header">
			<h1><?php echo $drink_name; ?></h1>
		</div>
		
		<div data-role="content">
			<h3>Leave a comment for <?php echo $drink_name; ?></h3>
			<input type="text" id="nameInputField" placeholder="Your nickname" /><br />
			<textarea id="commentTextArea" placeholder="Enter your comment here"></textarea>
			<br />
			<div data-role="controlgroup">
				<a href="#drinkPage" data-role="button" data-rel="back" id="submitCommentButton">Submit Comment</a>
			</div>	
		</div><!-- /content -->
	
	</div><!-- /page -->
	
	<?php mysql_close($con); ?>
	</body>
</html>
