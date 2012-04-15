<?php
	// TEMPORARY: USE SESSIONS TO KEEP LAST COMMENT
	session_start();
			
		$comments = array(
					json_encode(array("user" => "user1234", "comment" => "OMG SO GOOOOOOOD!!", "time" => "Apr 15, 2012, 8:23pm")),
					json_encode(array("user" => "coolkid34", "comment" => "dude, I hated that drink", "time" => "Apr 12, 2012, 2:23am")),
					json_encode(array("user" => "whoami", "comment" => "yeah that was really good", "time" => "Jan 2, 2012, 1:08am")));
					
		if (isset($_SESSION["id"]) && isset($_POST["param"])) {
			if ($_POST["param"] == $_SESSION["id"]) {
				$thiscomment = json_encode(array("user" => $_SESSION["user"], "comment" => $_SESSION["comment"], "time" => $_SESSION["time"]));
				array_unshift($comments, $thiscomment);
			}
		}
				
	echo json_encode($comments);			
	
?>