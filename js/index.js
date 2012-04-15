/* 
	Fat Charles 6.813 JS File
*/
$(document).on('pageinit', '#homePage', function() {//can add a selector
	$('div [data-role="controlgroup"]').addClass('ui-shadow');
});

$(document).on('pageinit', '#namePage', function() {
	$("#searchButton").tap(function() {
		$("#resultsList").empty();
		var searchString = $("#drinkName").val();
		var searchURL = "php/searchByName.php";
		if ($.trim(searchString) == "") {
			return;
		}
		$.post(
			searchURL,
			{ param : searchString },
			function(data) {
				$.each(data, function(key, value) {
					var obj = $.parseJSON(value);
					var itemStr = "<li><a href=\"drink.php?id=" + key + "\">" + obj.name;
					itemStr += "<span class=\"ui-li-count\">" + obj.rating + "</span></a></li>";
					$("#resultsList").append(itemStr);						
				});
				$("#resultsList").listview("refresh");
			},
			"json"
		);
	});
});

$(document).on('pageinit', '#drinkPage', function() {
	var isShowingComments = false;
	$("#showCommentButton").tap(function() {
		if (isShowingComments) {
			$("#commentDiv").empty();
			$(this).parent().find(".ui-btn-text").text("Show Comments");
			isShowingComments = false;
		} else {
			$(this).parent().find(".ui-btn-text").text("Hide Comments");
			var commentURL = "php/getComments.php";
			var drinkId = $("#drinkPage").data("drinkid");
			$.post(
				commentURL,
				{ param : drinkId },
				function(data) {
					if (data.length > 0) {
						$.each(data, function(key, value) {
							var obj = $.parseJSON(value);
							var commentStr = "<p>" + obj.user + " (" + obj.time + ")" + ": " + obj.comment + "</p>";
							$("#commentDiv").append(commentStr);
						});
					} else {
						$("#commentDiv").append("<i>There are no comments at this time</i>");
					}
				},
				"json"
			);
			isShowingComments = true;
		}
	});
	
	$("#voteUpButton").tap(function() {
		var current = $("#drinkRating").text().parseInt;
		$("#drinkRating").text(String(current+1));
	});
	
	$("#voteDownButton").tap(function() {
		var current = $("#drinkRating").text().parseInt;
		$("#drinkRating").text(String(current-1));
	});
		
});

$(document).on('pageinit', '#commentForm', function() { 
	$("#submitCommentButton").tap(function() {
		var drinkId = $("#commentForm").data("drinkid");
		var addCommentURL = "addComment.php";
		$.post(
			addCommentURL,
			{ id: drinkId, user: $("#nameInputField").val(), comment: $("#commentTextArea").val() },
			function(data) {
				$.mobile.changePage("../drink.php?id=" + drinkId);
			}
		);
	});
});
			

