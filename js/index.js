/* Fat Charles 6.813 JS File
*/
$(document).on('pageinit', '#homePage', function() {//can add a selector
	$('div [data-role="controlgroup"]').addClass('ui-shadow');
});

$(document).on('pageinit', '#namePage', function() {
	$("#resultsList").empty();
	$("#drinkName").empty();
	$("#searchButton").tap(function() {
		$("#resultsList").empty();
		var searchString = $("#drinkName").val();
		var searchURL = "php/searchByName.php";
		console.log(searchString);
		if ($.trim(searchString) == "") {
			return;
		}
		$.post(
			searchURL,
			{ param : searchString },
			function(data) {
				$.each(data, function(key, value) {
					var itemStr = "<li><a href=drinks.php?id=" + key + ">" + value + "</a></li>";
					console.log(itemStr);
					$("#resultsList").append(itemStr);						
				});
				$("#resultsList").listview("refresh");
			},
			"json"
		);
	});
});
/*
$(document).on('pageshow', '#namePage', function() {
	console.log('page shown');
	$('input[type="text"]').focus();
});*/


$("#drinkByNamePage").on("pageinit", function() {

});