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
		var visited = sessionStorage.getItem("visited");
		sessionStorage.clear();
		if (likes != null) {
			sessionStorage.setItem("likes", likes);
		}
		if (userCommentHist != null) {
			sessionStorage.setItem("userComment", userCommentHist);
		}
		if (visited != null) {
			sessionStorage.setItem("visited", visited);
		}
	});
});

$(document).on('pageshow', '#namePage', function() {
	alert("pageshow");
	var autoCompleteNames = Array();
	$.post(
		"php/getAllNames.php",
		{},
		function(data) {
			autoCompleteNames = data;
			$('#drinkName').autocomplete({
				minLength:3,
				source: autoCompleteNames,
				position: {
					my: "left top",
					of: $('#drinkName').parent(),
					at: "left bottom"
				},
				select:
					function(event, ui) {
						event.preventDefault();
						$("#drinkName").val(ui.item.value);
						if (event.which != 13) {
							$("#searchButton").trigger("tap");
						}
					}
				
			});
		},
		"json"
	);
});

$(document).on('pageinit', '#namePage', function() {
	
	
	$(this).keypress(function (e) {
		var code = (e.keyCode? e.keyCode: e.which);
		if (code == 13) {
		//	alert(autoCompleteNames.length);
		}
	});
	
	$('#drinkName').keypress(function (e) {
		var code = (e.keyCode? e.keyCode: e.which);
		if (code==13) {
			alert(autoCompleteNames.length);
			$('#searchButton').triggerHandler('tap');
		}
	});
	
	$("#searchButton").tap(function() {
		$("#drinkName").autocomplete("close");
		$("#searchResults").empty();
		var opts = {
			  lines: 13, // The number of lines to draw
			  length: 7, // The length of each line
			  width: 4, // The line thickness
			  radius: 10, // The radius of the inner circle
			  rotate: 0, // The rotation offset
			  color: '#000', // #rgb or #rrggbb
			  speed: 1, // Rounds per second
			  trail: 60, // Afterglow percentage
			  shadow: false, // Whether to render a shadow
			  hwaccel: false, // Whether to use hardware acceleration
			  className: 'spinner', // The CSS class to assign to the spinner
			  zIndex: 2e9, // The z-index (defaults to 2000000000)
			  top: 'auto', // Top position relative to parent in px
			  left: 'auto' // Left position relative to parent in px
		};
		var target = document.getElementById('searchResults');
		var searchString = $("#drinkName").val();
		var searchURL = "php/searchByName.php";
		if ($.trim(searchString) == "") {
			return;
		}
		var spinner = new Spinner(opts).spin(target);
	
		$.post(
			searchURL,
			{ param : searchString },
			function(data) {
				spinner.stop();
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
	var visited = sessionStorage.getItem("visited");
	if (visited == null) {
		visited = Array();
	} else {
		visited = JSON.parse(visited);
	}
	var drinkId = $("#drinkPage").data("drinkid");
	if (visited.indexOf(drinkId) == -1) {
		visited.push(drinkId);
	}
	sessionStorage.setItem("visited", JSON.stringify(visited));
	
	
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
		var numberLikes = $("#drinkPage").data("rating");
		var changeRatingURL = "php/changeRating.php";

		var likes = sessionStorage.getItem("likes");
		if (likes == null) {
			likes = {};
		} else {
			likes = JSON.parse(likes);
		}
		var isLiked = drinkId in likes;
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
					if (result == 1) {
						$("#drinkRating").text("You like this drink.");
					} else if (result == 2) {
						$("#drinkRating").text("You and one other person like this drink.");
					} else {
						$("#drinkRating").text("You and " + (result-1) + " other people like this drink.");
					}
				} else {
					if (result == 1) {
						$("#drinkRating").text("One person likes this drink.");
					} else {
						$("#drinkRating").text(result + " people like this drink.");
					}
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
			if (otherLikes == 0) {
				$("#drinkRating").text("You like this drink.");
			} else if (otherLikes == 1) {
				$("#drinkRating").text("You and 1 other person like this drink");
			} else{
				$("#drinkRating").text("You and " + otherLikes + " other people like this drink.");
			}
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
			
$(document).on('pageinit', /*'#beer, #juice, #liquor, #soda, #wine, #misc'*/ '.searchableIngredient', function() {
	if(sessionStorage['totalCount']==undefined) {
		sessionStorage['totalCount']=0;
		console.log('session storage for count initialized');
	}
	if (sessionStorage.getItem("ingredients") == null) {
		sessionStorage.setItem("ingredients", JSON.stringify({}));
	}	
	$(this).find('label').on('vclick', function(e) {
		//SOME STUFF RELATED TO SESSION STORAGE
		
		var id = $(this).attr("for");
		var text = $(this).text();
		var t = JSON.parse(sessionStorage.getItem("ingredients"));

		if ($("#" + id).attr("checked") == "checked") {
			t[id]=$.trim(text);
			sessionStorage['totalCount'] = parseInt(sessionStorage['totalCount']) + 1;
			console.log('incrementing totalCount');
			console.log(sessionStorage['totalCount']);
		} else {
			delete t[text];
			sessionStorage['totalCount'] = parseInt(sessionStorage['totalCount']) - 1;
			console.log('decrementing totalCount');
			console.log(sessionStorage['totalCount']);
		}
		sessionStorage.setItem("ingredients", JSON.stringify(t));

		//UPDATES THE BADGE TEXT
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

$(document).on('pageshow', '#ingredientsPage, .secondLevel, .searchableIngredient', function() {
	if(sessionStorage['totalCount']==0 || sessionStorage['totalCount']==undefined) {
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
	//SOME STYLING ON PAGE INIT
	$('#currIngredient').parent().removeClass('ui-btn-corner-all');
	$('#currIngredient').parent().removeClass('ui-icon-searchfield');
	$('div[data-role="footer"] a span').css('font-size','1em');
	$('#addIngredient').css('margin-left', 'auto');
	$('#addIngredient').css('margin-right', 'auto');
	$('#currIngredient').parent().css('padding', '0');
	$('#currIngredient').parent().css('margin-left', '3.5%');
	$('#currIngredient').css('width', '100%');
	$('#currIngredient').css('padding', '.4em');
	$('#currIngredient').parent().addClass('ui-corner-all');
	
	var removeBtn = $('tr:last a').detach();
	var ingredients = {};

	var autocompleteIngredients = Array();
	$.post(
		"php/getAllIngredients.php",
		{},
		function(data) {
			autoCompleteIngredients = data;
			$('#currIngredient').autocomplete({
				minLength:3,
				source: autoCompleteIngredients,
				position: {
					my: "left top",
					of: $('#currIngredient').parent(),
					at: "left bottom"
				}
			});
		},
		"json"
	);
	$('tr:last').detach();
	$('#addIngredient').click( function() {
		if ($.trim($('#currAmount').val())=='' || $.trim($('#currIngredient').val())=='') {
			return;
		}
		var row = $('<tr></tr>');
		var td = $('<td></td>');
		var text = $.trim($('#currAmount').val());
		td.text(text);
		row.append(td);
		td = $('<td></td>');
		text = $.trim($('#currIngredient').val());
		td.text(text);
		row.append(td);
		ingredients[text] = $.trim($('#currAmount').val());
//		console.log(ingredients);
		td = $('<td></td>');
		td.append(removeBtn.clone().click( 
			function() {
				var thistext = text;
				$(this).parent().parent().remove();
				delete ingredients[thistext];
//				console.log(ingredients);
			})
		);
		row.append(td);

		var inputRow = $('table tr:last').detach();
		$('table').append(row);
		$('table').append(inputRow);
		$('#currAmount').val('');
		$('#currIngredient').val('');
		//$('#removeIngredient').triggerHandler('click');
		$('#currIngredient').focus();
		$('#currAmount').focus();
	});
	
	$('#clearDrink').click(function() { //what happens when you click submit the drink.
		var header = $('table tr:first').detach();
		var last = $('table tr:last').detach();
		$.each($('table tr'), function(i, elem) {
			$(this).remove();
		});
		$('table').append(header);
		$('table').append(last);
		$('#instructionsText').remove();
		$('div[data-role="content"]').append($('<textarea></textarea>', {
			name:"instructions",
			id: 'instructionsText'
		}).textinput());
		$('#currAmount').val('');
		$("#currIngredient").val("");
		$("#drinkName").val("");
	});
	
	$('#submitDrink').click(function() {
		if ($('#drinkName').val()=='' || $('#instructionsText').val()=='' || Object.keys(ingredients).length) {
			return;
		}
		var submitURL = "php/submitDrink.php";
		var ingredientList = Array();
		var amountList = Array();
		for (var ingredient in ingredients) {
			ingredientList.push(ingredient);
			amountList.push(ingredients[ingredient]);
		}
		$.post(
			submitURL,
			{ name : $("#drinkName").val(), 'ingredients[]' : ingredientList, 'amounts[]' : amountList, instructions : $("#instructionsText").val() },
			function(data) {
				var id = data.id;
				$.mobile.changePage("drink.php?id="+id);
			},
			"json"
		);
	});
	
	$('#currIngredient').keypress(function(e) {
		var code = (e.keyCode? e.keyCode: e.which);
		if (code==13) {
			$('#addIngredient').triggerHandler('click');
		}
	});
});

$(document).on('pageshow', '#bin', function() {
	$("#binList").empty();
	var items = sessionStorage.getItem("ingredients");
	if (items != null) {
		$.each(JSON.parse(items), function(k, v)	{
			var liString = "<li id=" + k + ">" + v + "<div class='binRemove'><input type='button' class='binRemoveButton' data-icon='delete' data-inline='true' data-mini='true' data-iconpos='notext' /></div></li>";
			$("#binList").append(liString);
		});
	}
	$("#binList").listview("refresh");
	$(".binRemoveButton").button();
	
	$(".binRemoveButton").click(function() {
		var liItem = $(this).closest("li");
		var id = liItem.attr("id");
		liItem.remove();
		console.log(liItem);
		console.log(id);
		var items = sessionStorage.getItem("ingredients");
		if (items != null) {
			items = JSON.parse(items);
			delete items[id];
		}
		sessionStorage.setItem("ingredients", JSON.stringify(items));
		sessionStorage.removeItem(id);
		sessionStorage['totalCount'] = sessionStorage['totalCount']-1;
		$("#" + id).attr("checked", false);
		$("#" + id).checkboxradio("refresh");
	});
});	

$(document).on('pageshow', '#searchResults', function() {
	$("#resultsList").empty();
	var searchURL = "php/searchIngredients.php";
	$.post(
		searchURL,
		{ 'ingredients[]' : Object.keys(JSON.parse(sessionStorage.getItem("ingredients") || '{"GIANTPOOPS": ""}')) },
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

$(document).on('pageshow', '#recentPage', function() {
	$("#recentList").empty();
	var recentId = sessionStorage.getItem("visited");
	if (recentId == null) {
		$("#recentResults").append("<p>Nothing in your history. Go look at some drinks!</p>");
	} else {
		var searchURL = "php/getRecent.php";
		$.post(
			searchURL,
			{ 'id[]' : JSON.parse(recentId) },
			function (data) {
				$("#recentResults").append("<ul data-role=\"listview\" data-inset=\"true\" id=\"recentList\"></ul>");
				$.each(data, function(key, value) {
					var obj = $.parseJSON(value);
					var itemStr = "<li><a href=\"drink.php?id=" + obj.id + "\" data-ajax=\"false\">" + obj.name;
					itemStr += "<span class=\"ui-li-count\">" + obj.rating + " likes</span></a></li>";
					$("#recentList").append(itemStr);						
				});
				$("#recentList").listview();
			
			},
			"json"
		);
	}
});
