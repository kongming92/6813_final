/* Fat Charles 6.813 JS File
*/
$(document).on('pageinit', '#homePage', function() {//can add a selector
	$('div [data-role="controlgroup"]').addClass('ui-shadow');
});

$(document).on('pageinit', '#namePage', function() {
	setTimeout("$('input:first').focus()", 100);
	$('input[type="submit"]').click(function() {
		alert($('input[type=""]'));
	});
});

