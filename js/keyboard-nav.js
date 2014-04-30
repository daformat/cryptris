/**
 *	Binds <Esc> to clicking .btn-close, obviously won't work if 
 *  no .btn-close element is found
 *	@author: Mathieu Jouhet <mathieu@digitalcuisine.fr>
 *	@dependencies: jQuery
 */

$(function(){
	$(document).keydown(function(e){
		if(e.keyCode == 27){
			var $close = $('.btn-close');
			$close.click();
			window.location = $close.attr('href');
		}
	});
});