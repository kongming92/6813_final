/* Fat Charles 6.813 JS File
*/
$(document).on('pageinit', '#homePage', function() {//can add a selector
	$('div [data-role="controlgroup"]').addClass('ui-shadow');
});

$(document).on('pageinit', '#namePage', function() {
	$('input[type="submit"]').click(function() {
		alert($('input[type=""]'));
	});
});
/*
$(document).on('pageshow', '#namePage', function() {
	console.log('page shown');
	$('input[type="text"]').focus();
});*/
