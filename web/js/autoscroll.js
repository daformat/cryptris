$(function(){

	/*
	var scrollToElement = function( target, callback ) {
	    var topoffset = 30;
	    var speed = 4500;
	    var destination = jQuery( target ).offset().top - topoffset;
	    $scroll.animate( { scrollTop: destination}, speed, function() {
	        window.location.hash = target;
	        callback();
	    });
	    return false;
	}	
	*/

	var autoscroll = function(){
			var i = setInterval(function(){
			    var pos = $scroll.scrollTop();
			    $scroll.scrollTop(++pos);

    			if($scroll[0].scrollHeight - $scroll.scrollTop() == $scroll.outerHeight()) clearInterval(i);

			}, 20);
	}

	var $scroll = $('.autoscrolling');		
	$scroll.prepend('<div style="height:'+($( window ).height()-160)+'px"></div>');
	$scroll.append('<div style="height:'+($( window ).height()/4)+'px"></div>');

	/*
		setTimeout(function(){
			scrollToElement('.cryptris-logo-large', autoscroll);
		}, 0);
	*/

	autoscroll();
})