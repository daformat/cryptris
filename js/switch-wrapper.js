/**
 *	Switch active wrapper with a fade out + fade in effect
 *	@author: Mathieu Jouhet <mathieu@digitalcuisine.fr>
 *	@desc:	Transitions from the actual active wrapper element to the new one
 *	@dependencies: jQuery
 */

(function($) {
	$.switchWrapper = function (sel, _callback) {
		var $active = $('.wrapper.active'), // actual active wrapper
				$sel = $(sel);									// requested new wrapper
		
		if($active[0] != $sel[0]) {

			// fadeOut active wrapper
			$active.fadeOut(function() {
				$(this).removeClass('active');

				// fadeIn requested wrapper
				$sel.delay(100).fadeIn(function() {

					// Fire callback if any once the new wrapper has finished fading in
					if(_callback && typeof(_callback === "function" )) _callback();

				}).addClass('active');

			});

		} 

		else{
			// Active wrapper was already the one requested, fire callback if any
			if(_callback && typeof(_callback === "function" )) _callback();
		}
	}

}(jQuery));
