/* 
	Fat Charles 6.813 JS File
*/
$(document).on('pageinit', '#homePage', function() {//can add a selector
	$('div [data-role="controlgroup"]').addClass('ui-shadow');
});

$(document).on('pageinit', '#namePage', function() {
	$('#drinkName').keypress(function (e) {
		var code = (e.keyCode? e.keyCode: e.which);
		if (code==13) {
			$('#searchButton').triggerHandler('vclick');
		}
	});
	$("#searchButton").on('vclick', function() {
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
	
	var isVoteUp = false;
	var isVoteDown = false;
	
	$("#voteUpButton").tap(function() {
		var current = parseInt($("#drinkRating").text());
		if (isVoteDown) {
			$("#drinkRating").text(String(current+2));
		} else{
			$("#drinkRating").text(String(current+1));
		}
		$("#voteUpButton").button("disable");
		$("#voteDownButton").button("enable");
		isVoteUp = true;
		isVoteDown = false;
	});
	
	$("#voteDownButton").tap(function() {
		var current = parseInt($("#drinkRating").text());
		if (isVoteUp) {
			$("#drinkRating").text(String(current-2));
		} else{
			$("#drinkRating").text(String(current-1));
		}		$("#voteDownButton").button("disable");
		$("#voteUpButton").button("enable");
		isVoteDown = true;
		isVoteUp = false;
	});
		
});

$(document).on('pageinit', '#commentForm', function() { 
	$("#submitCommentButton").on('vclick', function() {
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

$(document).on('pageinit', '#bin', function() {
	$(".binRemoveButton").tap(function() {
		$(this).closest("li").remove();
		// MODIFICATIONS TO LOCAL STORAGE AND DOM
	});
});
			
$(document).on('pageinit', '#beer, #juice, #liquor, #soda, #wine, #misc', function() {
	$('label').on('vclick', function(e){
		var key = $(this).text();
		alert(key);
	});
});

$(document).on('pageinit', '#submitPage', function() {
	$('#addIngredient').on('vclick', function() {
		var row = $('<tr></tr>');
		$.each($('input'), function(i, elem) {
			if($(elem).val() == '') {
				return
			}
			var td = $('<td></td>');
			td.append($(elem).val());
		});
		td = $('<td></td>');
		var removeBtn = $('<a href="#" data-role="button" data-icon="delete" data-iconpos="left" data-inline="true" class="removeAddedIngredient">Remove</a>');
		td.append(removeBtn);
		row.append(td);

		var inputRow = $('table tr:last').detach();
		$('table').append(row);
		$('table').append(inputRow);
		$('#removeIngredient').triggerHandler('vclick');
	});
	$('#removeIngredient').on('vclick', function() {
		$('input').val('');
	});
	$('.removeAddedIngredient').on('vclick', function() {
		
	});
});
