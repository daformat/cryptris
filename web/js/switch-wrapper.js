(function($) {

	$.switchWrapper = function (sel, _callback){
		$('.wrapper.active').fadeOut(function(){
			$(this).removeClass('active');
			setTimeout(function(){
				$(sel).fadeIn().addClass('active');
				if(_callback && typeof(_callback === "function" )) _callback();
			}, 1000);
		});
	}

}(jQuery));
