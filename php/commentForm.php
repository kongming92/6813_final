<?php
	session_start();
	$id = $_GET["id"];
	$name = $_GET["name"];


?>

<!doctype html>
<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1"> 

		<link rel="stylesheet" type="text/css" href="../css/jquery.mobile-1.1.0.css" />
		<link rel="stylesheet" type="text/css" href="../css/index.css" />
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
		<script type="text/javascript" src="../js/jquery.mobile-1.1.0.js"></script>
		<script type="text/javascript" src="../js/index.js" ></script>

	</head>
	<body>
	<div data-role="page" id="commentForm">
		<script type="text/javascript">
			$(document).on("pageinit", function() {
				$("#commentForm").data("drinkid", <?php echo $id; ?>);
			});
		</script>
			
		<div data-role="header">
			<h1>Add comment for <?php echo $name; ?> </h1>
		</div>
	
		<div data-role="content">
			<input type="text" id="nameInputField" placeholder="Your nickname" /><br />
			<textarea id="commentTextArea" placeholder="Enter your comment here"></textarea>
			<input type="button" id="submitCommentButton" data-icon="search" data-inline="true" value="Submit Comment" />
		</div><!-- /content -->

	</div><!-- /page -->
	</body>
</html>
