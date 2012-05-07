<?php
	
    	$drinkid = $_POST["id"];
        $con = mysql_connect("localhost", "fat_charles_user", "fat_charles");
        mysql_select_db("fat_charles_db");
       
        $comments_query = mysql_query("SELECT username, comment, time FROM comments WHERE id=$drinkid ORDER BY time DESC");
       
        $comments = array("There are no comments at this time");
        $comment = mysql_fetch_assoc($comments_query);
        if (isset($comment["username"]) && isset($comment["time"]) && isset($comment["comment"])) {
                $comments = array();
                $comments[] = json_encode($comment);
                while ($comment = mysql_fetch_assoc($comments_query)) {
                        $comments[] = json_encode($comment);
                }
        }
       
       
        echo json_encode($comments);
		
		mysql_close($con);
	
?>


