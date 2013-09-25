(function($) {

	$.switchWrapper = function (sel, _callback){
		$('.wrapper.active').fadeOut(function(){
			$(this).removeClass('active');
			setTimeout(function(){
				$(sel).fadeIn(function(){
					if(_callback && typeof(_callback === "function" )) _callback();
				}).addClass('active');
			}, 100);
		});
	}

}(jQuery));
