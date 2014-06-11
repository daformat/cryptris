/**
 *	Counts characters left
 *	@author: Mathieu Jouhet <mathieu@digitalcuisine.fr>
 *	@dependencies: jQuery
 */

$(function(){
	var maxChars = cryptrisSettings.socialEncryptedMessageMaxLength || 140,
		$textarea = $("#share textarea"),
		$counter = $(".characters-left .count"),
		$text = $(".characters-left .text");

	/**
	 * CountCharactersLeft: waits for a small amount of time, then fires a change event on the textarea
	 */

	var countCharactersLeft = function(){
		// To make sure the value was updated, we need a small timeout
		setTimeout(function() {
			// Then we just fire a change event on the textarea
			$textarea.change();
		}, 40);

	};


	/**
	 * Update counter text and classes
	 */

	var updateCount = function(n) {
		$counter.text(n);
		
		// Css classes
		if(n<0) {
			$counter.addClass('red');
			$textarea.addClass('warning');
		}
		else {
			$counter.removeClass('red');
			$textarea.removeClass('warning');
		}

		// Pluralize text
		if(Math.abs(n)>1){
			$text.text("Caractères restants");
		} else {
			$text.text("Caractère restant");
		}

	};


	/**
	 * Assign event handlers
	 */

	// Count characters left on keydown, paste or cut event
	$textarea.keydown(countCharactersLeft).on('paste', countCharactersLeft).on('cut', countCharactersLeft);

	// Let's just make sure we count characters no matter where the focus is
	$(document).keydown(countCharactersLeft);

	// Finally, make sure character count is updated when clicking the submit button
	$('.button').click(countCharactersLeft);

	// Count characters
	$textarea.change(function() {
		var $t = $(this),
				v = $t.val();

		updateCount(maxChars-v.length);
	});

})