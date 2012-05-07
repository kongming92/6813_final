/*
	Fat Charles 6.813 JS File
*/
$(document).on('pageshow', '#homePage', function() {//can add a selector
	$('div [data-role="controlgroup"]').addClass('ui-shadow');
	$("a").tap(function() {
		sessionStorage.clear();
	});
});

$(document).on('pageinit', '#namePage', function() {
	$('#drinkName').keypress(function (e) {
		var code = (e.keyCode? e.keyCode: e.which);
		if (code==13) {
			$('#searchButton').triggerHandler('click');
		}
	});
	$("#searchButton").click(function() {
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
					var itemStr = "<li><a href=\"drink.php?id=" + obj.id + "\">" + obj.name;
					itemStr += "<span class=\"ui-li-count\">" + obj.rating + " likes</span></a></li>";
					$("#resultsList").append(itemStr);						
				});
				$("#resultsList").listview("refresh");
			},
			"json"
		);
	});
});

$(document).on('pageinit', '#drinkPage', function() {
	var isShowingComments = true;
	var currentComments;
	var firstComment = true;

	$("#showHideComments").tap(function() {
		if (isShowingComments) {
			currentComments = $("#commentDiv").html();
			$("#commentDiv").empty();
			$(this).text("(Show comments)")
			isShowingComments = false;
		} else {
			
			$("#commentDiv").html(currentComments);
			/*
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
			*/
			$(this).text("(Hide comments)");
			isShowingComments = true;
		}
	});
	
	var isLiked = false;
	var first = true;
	var numberLikes = 0;
	$("#likeButton").tap(function() {
		if (first) {
			numberLikes = $("#drinkPage").data("rating");
			first = false;
		}
		if (isLiked) {
			// ajax to decr num likes
			isLiked = false;
			numberLikes = numberLikes - 1;
			$("#likeButton").val("Like this drink");
			$("#likeButton").button("refresh");
		} else {
			// ajax to incr num likes
			isLiked = true;
			numberLikes = numberLikes + 1;
			$("#likeButton").val("Unlike this drink");
			$("#likeButton").button("refresh");
		}
		
		// ajax to get num likes
		$("#drinkRating").text(numberLikes + " people like this drink.");
		
	});
	
		
});

$(document).on('pageinit', '#commentForm', function() { 
	$("#submitCommentButton").click(function() {
		var drinkId = $("#commentForm").data("drinkid");
		var addCommentURL = "addComment.php";
		$.post(
			addCommentURL,
			{ id: drinkId, user: $("#nameInputField").val(), comment: $("#commentTextArea").val() },
			function(data) {
				//$.mobile.changePage("../drink.php?id=" + drinkId);
			}
		);
	});
});
			
$(document).on('pageinit', '#beer, #juice, #liquor, #soda, #wine, #misc', function() {
	if(sessionStorage['totalCount']==undefined) {
		sessionStorage['totalCount']=0;
		console.log('session storage for count initialized');
	}
		
	$('label').click(function(e){
		//SOME STUFF RELATED TO SESSION STORAGE
		e.preventDefault();
		var id = $(this).attr("for");
		var text = $(this).text();
		//console.log(id + " " + text);
		if ($("#" + id).attr("checked") == "checked") {
			sessionStorage.removeItem(id);
			sessionStorage['totalCount'] = parseInt(sessionStorage['totalCount']) - 1;
			console.log('decrementing totalCount');
			console.log(sessionStorage['totalCount']);
		} else {
			sessionStorage[id] = text;
			sessionStorage['totalCount'] = parseInt(sessionStorage['totalCount']) + 1;
			console.log('incrementing totalCount');
			console.log(sessionStorage['totalCount']);
		}
		
		//UPDATE THE BADGE TEXT ----------------------------__FIX THIS
		if (sessionStorage['totalCount']==0) {
			$('.badges').css('visibility', 'hidden');
			$('.counterDisplay').text('');
		} else {
			$('.badges').css('visibility', 'visible');
			$('.badges').css('top', $(this).children('div[data-role="header"]').children('a:last').position().top);
			$('.badges').css('left', $(this).children('div[data-role="header"]').children('a:last').position().left-$('.badges:first').width());
			
			$('.counterDisplay').css('top', $(this).children('div[data-role="header"]').children('img').position().top);
			$('.counterDisplay').css('left', $(this).children('div[data-role="header"]').children('img').position().left);
			$('.counterDisplay').css('width', $('.badges:first').width());
			$('.counterDisplay').css('height', $('.badges:first').height());
			$('.counterDisplay').css('margin-top', $('.counterDisplay').height()/5);
			$('.counterDisplay').text(sessionStorage['totalCount']);
		}
	});
});

$(document).on('pageshow', '#beer, #juice, #liquor, #soda, #wine, #misc', function() {
	if(sessionStorage['totalCount']==0) {
		return ;
	} else {
		$('.badges').css('visibility', 'visible');
		$('.badges').css('top', $(this).children('div[data-role="header"]').children('a:last').position().top);
		$('.badges').css('left', $(this).children('div[data-role="header"]').children('a:last').position().left-$('.badges:first').width());
		//$(this).children('div[data-role="header"]').children('img') select for the image
		$('.counterDisplay').css('top', $(this).children('div[data-role="header"]').children('img').position().top);
		$('.counterDisplay').css('left', $(this).children('div[data-role="header"]').children('img').position().left);
		$('.counterDisplay').css('width', $('.badges:first').width());
		$('.counterDisplay').css('height', $('.badges:first').height());
		$('.counterDisplay').css('margin-top', $('.counterDisplay').height()/5);
		$('.counterDisplay').text(sessionStorage['totalCount']);
	}
});

$(document).on('pageinit', '#submitPage', function() {
	var removeBtn = $('tr:last a').detach();
	$('tr:last').detach();
	$('#addIngredient').click( function() {
		var row = $('<tr></tr>');
		var td = $('<td></td>');
		td.text($('#currIngredient').val());
		row.append(td);
		td = $('<td></td>');
		td.append(removeBtn.clone().click( 
			function() {
				$(this).parent().parent().remove();
			})
		);
		row.append(td);

		var inputRow = $('table tr:last').detach();
		$('table').append(row);
		$('table').append(inputRow);
		$('#removeIngredient').triggerHandler('click');
		$('input').focus();
	});
	
	$('#removeIngredient').click(function() { //this just takes care of clearing it. this is the handler for when you hit "Clear".
		$('input').val('');
	});
	
	$('#submitDrink').click(function() { //what happens when you click submit the drink.
		alert('Successfully submitted drink');
		var header = $('table tr:first').detach();
		var last = $('table tr:last').detach();
		$.each($('table tr'), function(i, elem) {
			$(this).remove();
		});
		$('textarea').val('');
		$('table').append(header);
		$('table').append(last);
	});
});

$(document).on('pageshow', '#bin', function() {
	$("#binList").empty();
	$.each(sessionStorage, function(k, v)	{
		var id = sessionStorage.key(k);
		var liString = "<li id=" + id + ">" + sessionStorage[id] + "<div class=\"binRemove\"><input type=\"button\" class=\"binRemoveButton\" data-icon=\"delete\" data-inline=\"true\" data-mini=\"true\" data-iconpos=\"notext\" /></div></li>";
		$("#binList").append(liString);
	});
	$("#binList").listview("refresh");
	$(".binRemoveButton").button();
	
	$(".binRemoveButton").click(function() {
		var liItem = $(this).closest("li");
		var id = liItem.attr("id");
		liItem.remove();
		console.log(liItem);
		console.log(id);
		sessionStorage.removeItem(id);
		$("#" + id).attr("checked", false);
		$("#" + id).checkboxradio("refresh");
	});
});	

$(document).on('pageshow', '#searchResults', function() {
	$("#resultsList").empty();
	var searchURL = "php/searchByName.php";
	$.post(
		searchURL,
		{ param : "" },
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
