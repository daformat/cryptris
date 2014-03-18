/**
 *	Autoscrolling feature used in credits
 *	@author: Mathieu Jouhet <mathieu@digitalcuisine.fr>
 *	@dependencies: jQuery
 */

$(function(){

	var autoscroll = function(){
			var i = setInterval(function(){
			    var pos = $scroll.scrollTop();
			    $scroll.scrollTop(++pos);

    			if($scroll[0].scrollHeight - $scroll.scrollTop() == $scroll.outerHeight()) {
    				clearInterval(i);
    				$("#spacer").remove();
    			}

			}, 20);
	}

	var $scroll = $('.autoscrolling');	

  // We add some margins to the autoscrolling element	
	$scroll.prepend('<div id="spacer" style="height:'+($( window ).height()-160)+'px"></div>');
	$scroll.append('<div style="height:'+($( window ).height()/4)+'px"></div>');

  // And launch the autoscroll
	autoscroll();
})
