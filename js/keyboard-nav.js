$(function(){
	$(document).keydown(function(e){
		if(e.keyCode == 27){
			var $close = $('.btn-close');
			$close.click();
			window.location = $close.attr('href');
		}
	});
});