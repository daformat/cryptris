/**
 *	Type letter by letter effect for cryptris
 *	@author: Mathieu Jouhet <mathieu@digitalcuisine.fr>
 *	@desc:	display any given html string letter by letter,
 *					html tags are displayed as a character
 * 	@dependencies: jQuery
 */

(function($){

	var tag, n, s, nn, _callback, unfinished;


	/**
	 *	$(elem).typeLetterByLetter 
	 *	@params:	(String) text - text to animate
	 *						(Int) speed - delay between each letter / tag is displayed
	 *						(Function) callback - callback function executed once animation is complete
	 */

	$.fn.typeLetterByLetter = function(text, speed, callback){
		
		// cancel any previous animation if not complete;
		clearTimeout(unfinished);

		// Initialize
		_callback = callback;
		n = 0;
		nn = 0;	

		// total expected length of the final string
		s = $('<div>').append(text).html().length;

		// flag to check if we are inside of an html tag (basic)
		tag = false;

		// Start recursive display function
		typeAnother(this, text, speed);

		// Ensure jQuery chaining isn't broken
		return this;
	}


	/**
	 *	private function typeAnother($element, text, speed)
	 *	@desc:	recursively display another letter / html tag
	 *	@params:	(jQueryElement) $element - jQuery element where to display text.
	 *						(String) - html / text to display.
	 *						(Speed) - delay between each character
	 */

	var typeAnother = function ($e, text, speed){
		// Get the target's html string length
		nn = $e.html().length;

		// If that's anywhere under expected length 
		if(nn < s) {

			// grab another character to display
			c = text.substr(n, 1)

			// check for html tag start / end
			// TODO: improve html detection
			if ( c === '<') tag = true; 
			else if ( c === '>') tag = false; 

			// add another letter
			$e.html(text.substr(0, ++n));
			
			// If we are inside of a tag, let's not wait
			if(tag === true){
				typeAnother($e, text, speed);
			}

			// If not, set timeout for the next character to be displayed
			else {
				unfinished = setTimeout(function(){typeAnother($e, text, speed)}, speed);
			}

		} else { 
			
			// We've reached our destination, let's fire the callback if any.
			if(_callback && typeof(_callback === "function" )) _callback();
		}
	}

}(jQuery));