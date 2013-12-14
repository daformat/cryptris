/**
 *	Plugin for the cryptris menus behavior
 *	@author: Mathieu Jouhet <mathieu@digitalcuisine.fr>
 *	@desc:	Allow keyboard input, handle .active class on selected element.
 *					Use directionnal keys to select, enter or space to confirm selection.
 *	@dependencies: jQuery
 */

 $(function(){

 	// Mouse handler to add / remove .active class on hovering

	$(document).on('mouseenter', ".selectable li", function(){
		$('.selectable li').removeClass('active');
		$(this).addClass('active');
	})


	// Keyboard handler

	$(document).keydown(function(e){
			
			// up - cycle up the options

	    if (e.keyCode == 38) {
	      var $selected = $('.selectable li.active').removeClass('active');

				if($selected.length>0) {
					var $choices = $('.selectable li');
		    	$choices.eq(($choices.index($selected) - 1) % $choices.length).addClass("active");	       
					return false;	
				}

	    }


	    // down - cycle down the options

	    else if (e.keyCode == 40) {
	      var $selected = $('.selectable li.active').removeClass('active');
				if($selected.length>0) {
					var $choices = $('.selectable li');
		    	$choices.eq(($choices.index($selected) + 1) % $choices.length).addClass("active");	       
					return false;	
				}
	    }


	    // enter || space - confirms selection

			else if (e.keyCode == 13 || e.keyCode == 32) {

				var $a = $('.selectable li.active a'),
						h = $a.attr('href');

				// If we got not match, get the last link on the .active element (validates a dialog ?)
				if($a.length == 0 ) {
					$a = $('.active a').last();
				}

				// We got a match, navigate to url if needed and click it.
				if($a.length>0) {

					if(h && h != "#") window.location = h;
					$a.click();
					
					return false;
				}
			}

	});
});