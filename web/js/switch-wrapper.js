(function($) {

	$.switchWrapper = function (sel, _callback){
		var $active = $('.wrapper.active'),
				$sel = $(sel);
		
		if($active[0] != $sel[0]){

			// fadeOut active wrapper
			$active.fadeOut(function(){
				$(this).removeClass('active');

				// fadeIn requested wrapper
				setTimeout(function(){
					$sel.fadeIn(function(){
						if(_callback && typeof(_callback === "function" )) _callback();
					}).addClass('active');
				}, 100);

			});
		} else{
			// Active wrapper was already the on requested, fire callback if any
			if(_callback && typeof(_callback === "function" )) _callback();
		}
	}

}(jQuery));
