$(function(){

	$(document).on('mouseenter', ".selectable li", function(){
		$('.selectable li').removeClass('active');
		$(this).addClass('active');
	})

	$(document).keydown(function(e){
	    if (e.keyCode == 38) { //up
	      var $selected = $('.selectable li.active').removeClass('active');
				var $choices = $selected.parent().children();
		    $choices.eq(($choices.index($selected) - 1) % $choices.length).addClass("active");
	      return false;
	    }
	    else if (e.keyCode == 40) { // down 
	      var $selected = $('.selectable li.active').removeClass('active');
				var $choices = $selected.parent().children();
		    $choices.eq(($choices.index($selected) + 1) % $choices.length).addClass("active");	       
	    }
			else if (e.keyCode == 13 || e.keyCode == 32) { // enter || space
				var $a = $('.selectable li.active a');
				window.location = $a.attr('href');
				$a.click();
			}
	});
});