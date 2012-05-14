<?php

$con = mysql_connect("localhost","fat_charles_user","fat_charles");
if (!$con){
	die("Could not connect: ".mysql_error());
}

mysql_select_db("fat_charles_db");

print <<<END
<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" /> 

		<link rel="stylesheet" type="text/css" href="./jquery_ui/css/smoothness/jquery-ui-1.8.20.custom.css">
		<link rel="stylesheet" type="text/css" href="./css/jquery.mobile-1.1.0.css" />
		<link rel="stylesheet" type="text/css" href="./css/index.css" />
		
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
		<script type="text/javascript" src="./js/jquery-ui-1.8.20.custom.min.js"></script>
		<script type="text/javascript" src="./js/jquery.mobile-1.1.0.js"></script>
		<script type="text/javascript" src="./js/index.js" ></script>
	</head>
	<body>
	<div data-role="page" id="ingredientsPage">
		<div data-role="header">
			<a href="index.html" data-type="button" data-icon="arrow-l">Home</a>
			<h1>Ingredients</h1>
			<a href="#bin" data-type="button" data-icon="grid" data-iconpos="right">Selections</a><span class="counterDisplay"></span><img src="img/badgetext.png" class="badges" height="10%" width="10%"></img>

		</div>

		<div data-role="content">
			<ul data-role="listview">
END;

$categories = array();
$results = mysql_query("select distinct category1 from categories;");
while(list($category) = mysql_fetch_array($results)){
	$categories[] = $category;
	echo "<li><a href=\"drinkByIngredients.php#$category\">$category</a></li>";
}
/*print <<<END
				<li><a href="drinkByIngredients.html#beer">Beer</a></li>
				<li><a href="drinkByIngredients.html#juice">Juice</a></li>
				<li><a href="drinkByIngredients.html#liquor">Liquor</a></li>
				<li><a href="drinkByIngredients.html#soda">Soda</a></li>
				<li><a href="drinkByIngredients.html#wine">Wine</a></li>
				<li><a href="drinkByIngredients.html#misc">Other Ingredients</a></li>
END;*/
print <<<END
			</ul>
		</div><!-- /content -->
		
		<div data-role="footer" style="text-align:center">
			<a href="#searchResults" data-type="button" data-icon="search" data-iconpos="right">Search for Drinks</a>
		</div>

	</div><!-- /page -->
END;

foreach($categories as $category){
print <<<END
<div data-role="page" id="$category">
                <div data-role="header">
                        <a href="#" data-type="button" data-icon="arrow-l" data-rel="back">Ingredients</a>
                        <h1>$category</h1>
                        <a href="#bin" data-type="button" data-icon="grid" data-iconpos="right">Selections</a><span class="counterDisplay"></span><img src="img/badgetext.png" class="badges" height="10%" width="10%"></img>

                </div>

                <div data-role="content">
                        <ul data-role="listview">
END;

	$results = mysql_query("select distinct category2 from categories where category1 = '$category';");
	while(list($cat2) = mysql_fetch_array($results)){
		echo "<li><a href=\"drinkByIngredients.php#$category-$cat2\">$cat2</a></li>";
	}

print <<<END
                        </ul>
                </div><!-- /content -->

                <div data-role="footer" style="text-align:center">
                        <a href="#searchResults" data-type="button" data-icon="search" data-iconpos="right">Search for Drinks</a>
                </div>

        </div><!-- /page -->
END;
}

foreach($categories as $category){
	$results = mysql_query("select distinct category2 from categories where category1 = '$category';");
	while(list($cat2) = mysql_fetch_array($results)){
print <<<END
        <!-- Start of $category-$cat2 page -->
        <div data-role="page" id="$category-$cat2" class="searchableIngredient">
                <div data-role="header">
                        <a href="#" data-type="button" data-icon="arrow-l" data-rel="back">Ingredients</a>
                        <h1>$cat2</h1>
            <a href="#bin" data-type="button" data-icon="grid" data-iconpos="right">Selections</a><span class="counterDisplay"></span><img src="img/badgetext.png" class="badges" height="10%" width="10%"></img>

                </div>

                <div data-role="content">
                        <div data-role="fieldcontain">
                                <fieldset data-role="controlgroup">
END;
		
		$nicknames = array();	
		$results2 = mysql_query("select distinct nickname from categories where category1 = '$category' and category2 = '$cat2';");
		while(list($nickname) = mysql_fetch_array($results2)){
			$nicknames[] = $nickname;
		}
		
		asort($nicknames);
		
		foreach($nicknames as $nickname){
			echo "<input type=\"checkbox\" id=\"$nickname\" data-corners=\"false\" />";
	                echo "<label for=\"$nickname\">$nickname</label>";
		}
print <<<END
				</fieldset>
			 </div>
		</div><!-- /content -->
		
		<div data-role="footer" style="text-align:center">
			<a href="#searchResults" data-type="button" data-icon="search" data-iconpos="right">Search for Drinks</a>
		</div>
	</div><!-- /$category-$cat2 page -->
END;
	}
}
/*	
	 <!-- Start of Juice page: #juice -->
	<div data-role="page" id="juice">
		<div data-role="header">
				<a href="#" data-type="button" data-icon="arrow-l" data-rel="back">Ingredients</a>
				<h1>Juice</h1>
				<a href="#bin" data-type="button" data-icon="grid" data-iconpos="right">Selections</a><span class="counterDisplay"></span><img src="img/badgetext.png" class="badges" height="10%" width="10%"></img>
				
		</div>

		<div data-role="content">
			<div data-role="fieldcontain">
				<fieldset data-role="controlgroup">
					<input type="checkbox" id="juice1" data-corners="false" />
					<label for="juice1">Orange Juice</label>
					<input type="checkbox" id="juice2" data-corners="false" />
					<label for="juice2">Cranberry Juice</label>
					<input type="checkbox" id="juice3" data-corners="false" />
					<label for="juice3">Apple Juice</label>
					<input type="checkbox" id="juice4" data-corners="false" />
					<label for="juice4">Pineapple Juice</label>
					<input type="checkbox" id="juice5" data-corners="false" />
					<label for="juice5">Mango Juice</label>
				</fieldset>
			</div>
	</div><!-- /content -->
		
		<div data-role="footer" style="text-align:center">
			<a href="#searchResults" data-type="button" data-icon="search" data-iconpos="right">Search for Drinks</a>
		</div>
	</div><!-- /Juice page -->

	<!-- Start of Liquor page: #liquor -->
	<div data-role="page" id="liquor">
		<div data-role="header">
				<a href="#" data-type="button" data-icon="arrow-l" data-rel="back">Ingredients</a>
				<h1>Liquor</h1>
				<a href="#bin" data-type="button" data-icon="grid" data-iconpos="right">Selections</a><span class="counterDisplay"></span><img src="img/badgetext.png" class="badges" height="10%" width="10%"></img>

		</div>

		<div data-role="content">
			<div data-role="fieldcontain">
				<fieldset data-role="controlgroup">
					<input type="checkbox" id="liquor1" data-corners="false" />
					<label for="liquor1">Vodka</label>
					<input type="checkbox" id="liquor2" data-corners="false" />
					<label for="liquor2">Rum</label>
					<input type="checkbox" id="liquor3" data-corners="false" />
					<label for="liquor3">Gin</label>
					<input type="checkbox" id="liquor4" data-corners="false" />
					<label for="liquor4">Tequila</label>
					<input type="checkbox" id="liquor5" data-corners="false" />
					<label for="liquor5">Whiskey</label>
				</fieldset>
			</div>
		</div><!-- /content -->
		<div data-role="footer" style="text-align:center">
			<a href="#searchResults" data-type="button" data-icon="search" data-iconpos="right">Search for Drinks</a>
		</div>
	</div><!-- /Liquor page -->

	<!-- Start of Soda page: #soda -->
	<div data-role="page" id="soda">
			<div data-role="header">
					<a href="#" data-type="button" data-icon="arrow-l" data-rel="back">Ingredients</a>
					<h1>Soda</h1>
					<a href="#bin" data-type="button" data-icon="grid" data-iconpos="right">Selections</a><span class="counterDisplay"></span><img src="img/badgetext.png" class="badges" height="10%" width="10%"></img>

		   </div>

			<div data-role="content">
				<div data-role="fieldcontain">
					<fieldset data-role="controlgroup">
						<input type="checkbox" id="soda1" data-corners="false" />
						<label for="soda1">Cola</label>
						<input type="checkbox" id="soda2" data-corners="false" />
						<label for="soda2">Lemon-lime</label>
						<input type="checkbox" id="soda3" data-corners="false" />
						<label for="soda3">Ginger Ale</label>
						<input type="checkbox" id="soda4" data-corners="false" />
						<label for="soda4">Tonic Water</label>
						<input type="checkbox" id="soda5" data-corners="false" />
						<label for="soda5">Grape Soda</label>
						<input type="checkbox" id="soda6" data-corners="false" />
						<label for="soda6">Orange Soda</label>
						<input type="checkbox" id="soda7" data-corners="false" />
						<label for="soda7">Dr. Pepper</label>
					</fieldset>
				</div>
			</div><!-- /content -->
			<div data-role="footer" style="text-align:center">
				<a href="#searchResults" data-type="button" data-icon="search" data-iconpos="right">Search for Drinks</a>
			</div>
	</div><!-- /Soda page -->

	<!-- Start of Wine page: #wine -->
	<div data-role="page" id="wine">
			<div data-role="header">
					<a href="#" data-type="button" data-icon="arrow-l" data-rel="back">Ingredients</a>
					<h1>Wine</h1>
					<a href="#bin" data-type="button" data-icon="grid" data-iconpos="right">Selections</a><span class="counterDisplay"></span><img src="img/badgetext.png" class="badges" height="10%" width="10%"></img>

			</div>

			<div data-role="content">
				<div data-role="fieldcontain">
					<fieldset data-role="controlgroup">
						<input type="checkbox" id="wine1" data-corners="false" />
						<label for="wine1">Red Wine</label>
						<input type="checkbox" id="wine2" data-corners="false" />
						<label for="wine2">White Wine</label>
						
					</fieldset>
				</div>
			</div><!-- /content -->
			<div data-role="footer" style="text-align:center">
				<a href="#searchResults" data-type="button" data-icon="search" data-iconpos="right">Search for Drinks</a>
			</div>
	</div><!-- /Wine page -->

	<!-- Start of Misc page: #misc -->
	<div data-role="page" id="misc">
			<div data-role="header">
					<a href="#" data-type="button" data-icon="arrow-l" data-rel="back">Ingredients</a>
					<h1>Misc</h1>
*/
print <<<END
	<!-- Start of bin page: #bin -->
	<div data-role="page" id="bin">
		<div data-role="header">
			<a href="#" data-type="button" data-icon="arrow-l" data-rel="back">Back</a>
			<h1>Your Current Selections</h1>
		</div>
		
		<div data-role="content">
			<ul data-role="listview" id="binList"></ul>
		</div>
		<div data-role="footer" style="text-align:center">
			<a href="#searchResults" data-type="button" data-icon="search" data-iconpos="right">Search for Drinks</a>
		</div>
	</div>
 
    <!-- Start of search results page: #searchResults -->
	<div data-role="page" id="searchResults">
		<div data-role="header">
			<a href="drinkByIngredients.php" data-type="button" data-icon="arrow-l">Back</a>
			<h1>Search Results</h1>
			<a href="#bin" data-type="button" data-icon="grid" data-iconpos="right">Selections</a>
		</div>
		<div data-role="content">
			<ul data-role="listview" data-inset="true" id="resultsList"></ul>
		</div>
	</div>
	</body>
</html>
END;

mysql_close();

?>
