/*
	Fat Charles 6.813 JS File
*/
$.ajaxSetup( {
	cache: false
});
$.mobile.pushStateEnabled = false;


$(document).on('pageinit', '#homePage', function() {
	$('div [data-role="controlgroup"]').addClass('ui-shadow');
	$("a").tap(function() {
		var likes = sessionStorage.getItem("likes");
		var userCommentHist = sessionStorage.getItem("userComment");
		sessionStorage.clear();
		if (likes != null) {
			sessionStorage.setItem("likes", likes);
		}
		if (userCommentHist != null) {
			sessionStorage.setItem("userComment", userCommentHist);
		}
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
		$("#searchResults").empty();
		var searchString = $("#drinkName").val();
		var searchURL = "php/searchByName.php";
		if ($.trim(searchString) == "") {
			return;
		}
		$.post(
			searchURL,
			{ param : searchString },
			function(data) {
				if (data.length == 0) {
					$("#searchResults").append("<p>No drinks matched your search input</p>");
				} else {
					$("#searchResults").append("<ul data-role=\"listview\" data-inset=\"true\" id=\"resultsList\"></ul>");
					$.each(data, function(key, value) {
						var obj = $.parseJSON(value);
						var itemStr = "<li><a href=\"drink.php?id=" + obj.id + "\" data-ajax=\"false\">" + obj.name;
						itemStr += "<span class=\"ui-li-count\">" + obj.rating + " likes</span></a></li>";
						$("#resultsList").append(itemStr);						
					});
					$("#resultsList").listview();
				}
			},
			"json"
		);
	});
});

$(document).on('pageinit', '#drinkPage', function() {
	var isShowingComments = true;
	var currentComments;
	
	$("#showHideComments").tap(function() {
		if ($(this).text().indexOf("Hide") != -1) {
			console.log("showing true");
			isShowingComments = true;
		}
		if (isShowingComments) {
			currentComments = $("#commentDiv").html();
			$("#commentDiv").empty();
			$(this).text("(Show comments)")
			isShowingComments = false;
		} else {
			$("#commentDiv").html(currentComments);
			$(this).text("(Hide comments)");
			isShowingComments = true;
		}
	});
	
	$("#likeButton").tap(function() {
		var drinkId = $("#drinkPage").data("drinkid");
		var numberLikes = $("#drinkPage").data("rating");
		var changeRatingURL = "php/changeRating.php";

		var likes = sessionStorage.getItem("likes");
		if (likes == null) {
			likes = {};
		} else {
			likes = JSON.parse(likes);
		}
		var isLiked = drinkId in likes;
		console.log(isLiked);
		if (isLiked) {
			$.post(
				changeRatingURL,
				{ id : drinkId, param : "decr" },
				function(data) { //do nothing 
				}
			);	
			$("#likeButton").val("Like this drink");
			$("#likeButton").button("refresh");
			delete likes[drinkId];
		} else {
			$.post(
				changeRatingURL,
				{ id : drinkId, param : "incr" },
				function(data) { //do nothing 
				}
			);			
			$("#likeButton").val("Unlike this drink");
			$("#likeButton").button("refresh");
			likes[drinkId] = null;
		}
		console.log(likes);
		sessionStorage.setItem("likes", JSON.stringify(likes));
		var getRatingURL = "php/getRating.php";
		$.post(
			getRatingURL,
			{ id : drinkId },
			function(data) {
				var result = parseInt($.parseJSON(data).rating);
				if (isLiked) {
					$("#drinkRating").text("You and " + (result-1) + " other people like this drink.");
				} else {
					$("#drinkRating").text(result + " people like this drink.");
				}
			}
		);
		isLiked = !isLiked;
	});
});

$(document).on('pageshow', '#drinkPage', function() {
	var likes = sessionStorage.getItem("likes");
	if (likes != null) {
		likes = JSON.parse(likes);
		if ($("#drinkPage").data("drinkid") in likes) {
			var otherLikes = $("#drinkPage").data("rating") - 1;
			$("#likeButton").val("Unlike this drink");
			$("#likeButton").button("refresh");
			$("#drinkRating").text("You and " + otherLikes + " other people like this drink.");
		}
	}
});

$(document).on('pageshow', '#commentPage', function() {
	var userCommentHist = sessionStorage.getItem("userComment");
	if (userCommentHist != null) {
		$("#nameInputField").val(userCommentHist);
	} else {
		$("#nameInputField").val("");
	}
	$("#commentTextArea").val("");
});

$(document).on('pageinit', '#commentPage', function() {
	$("#submitCommentButton").click(function() {
		var drinkId = $("#drinkPage").data("drinkid");
		var addCommentURL = "php/saveComment.php";
		var name = $("#nameInputField").val();
		var commentText = $("#commentTextArea").val();
		if ($.trim(name) == "" || $.trim(commentText) == "") {
			console.log("EMPTY");
		} else {
			sessionStorage.setItem("userComment", name);
			$.post(
				addCommentURL,
				{ id: drinkId, nameInputField: name, commentTextArea: commentText },
				function(data) {
					var getCommentURL = "php/getComments.php";
					$.post(
						getCommentURL,
						{ id: drinkId },
						function(resp) {
							$("#drinkPage #commentDiv").empty();
							$.each(resp, function(key, value) {
								var obj = $.parseJSON(value);
								var commentStr = "<p>" + obj.username + " (" + obj.time + "): " + obj.comment + "</p>";
								$("#drinkPage #commentDiv").append(commentStr);
								$("#drinkPage #showHideComments").text("(Hide comments)");
							});
						},
						"json"
					);			
				}
			);
			$.mobile.changePage($("#drinkPage"));
		}
	});
});
			
$(document).on('pageinit', '#beer, #juice, #liquor, #soda, #wine, #misc', function() {
	if(sessionStorage['totalCount']==undefined) {
		sessionStorage['totalCount']=0;
		console.log('session storage for count initialized');
	}
		
	//$(this).find('input[type="checkbox"]').bind('change', function(e, ui){
	$(this).find('label').on('vclick', function(e) {
		//SOME STUFF RELATED TO SESSION STORAGE
		//e.preventDefault();
		var id = $(this).attr("for");
		var text = $(this).text();
		//console.log(id + " " + text);
		if ($("#" + id).attr("checked") == "checked") {
			sessionStorage[id] = text;
			sessionStorage['totalCount'] = parseInt(sessionStorage['totalCount']) + 1;
			console.log('incrementing totalCount');
			console.log(sessionStorage['totalCount']);
		} else {
			sessionStorage.removeItem(id);
			sessionStorage['totalCount'] = parseInt(sessionStorage['totalCount']) - 1;
			console.log('decrementing totalCount');
			console.log(sessionStorage['totalCount']);
		}
		
		//TODO: UPDATE THE BADGE TEXT ----------------------------__FIX THIS
		if (sessionStorage['totalCount']==0) {
			$('.badges').css('visibility', 'hidden');
			$('.counterDisplay').text('');
		} else {
			$('.badges').css('visibility', 'visible');
			$('.badges').css('top', $.mobile.activePage.children('div[data-role="header"]').children('a:last').position().top);
			$('.badges').css('left', $.mobile.activePage.children('div[data-role="header"]').children('a:last').position().left-$('.badges:first').width());
			
			$('.counterDisplay').css('top', $.mobile.activePage.children('div[data-role="header"]').children('img').position().top);
			$('.counterDisplay').css('left', $.mobile.activePage.children('div[data-role="header"]').children('img').position().left);
			$('.counterDisplay').css('width', $('.badges:first').width());
			$('.counterDisplay').css('height', $('.badges:first').height());
			$('.counterDisplay').css('margin-top', $('.counterDisplay').height()/5);
			$('.counterDisplay').text(sessionStorage['totalCount']);
			$(".counterDisplay, .badges").effect("pulsate", {times: 2}, 400);
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
		var liString = "<li id=" + id + ">" + sessionStorage[id] + "<div class='binRemove'><input type='button' class='binRemoveButton' data-icon='delete' data-inline='true' data-mini='true' data-iconpos='notext' /></div></li>";
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
