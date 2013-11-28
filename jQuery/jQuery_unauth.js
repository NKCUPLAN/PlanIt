$(document).ready(function(){
	AdjustCoverSize();
	
	$(window).resize(function(){
		AdjustCoverSize();
	});
});

var AdjustCoverSize = function(){
	var h = $(document).height();
    var w = $(document).width();
	
    $('#cover').css('marginTop', $('.ui.inverted.menu').height());
	$('#cover').css('height', h - $('.ui.inverted.menu').height());
	$('#cover_lock').css('width', $('#cover_lock').height());
	$('#cover_lock').css('top', $('#cover').height() * 0.6 - $('#cover_lock').height() / 2);
}