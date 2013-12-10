(function($){

	var tag, n, s, nn, _callback, unfinished;

	$.fn.typeLetterByLetter = function(text, speed, callback){
		// cancel previous animation if not complete;
		clearTimeout(unfinished);

		// total length for the finished text
		s = $('<div>').append(text).html().length;

		// flag to check if we are inside of an html tag (basic)
		tag = false;

		n = 0;
		nn = 0;

		typeAnother(this, text, speed);

		_callback = callback;

		return this;
	}

	var typeAnother = function ($e, text, speed){
		nn = $e.html().length;

		if(nn < s) {
			c = text.substr(n, 1)

			if ( c === '<') tag = true; 
			else if ( c === '>') tag = false; 

			// add another letter
			$e.html(text.substr(0, ++n));
			
			if(tag === true){
				// alert("In tag ");
				typeAnother($e, text, speed);
			}
			else
				unfinished = setTimeout(function(){typeAnother($e, text, speed)}, speed);
		} else { 
			
			//$e.html(text).css('background', '#dad');
			//alert("Texte terminé : "+$e.html());
			//console.log("fin du texte : "+text);
			
			if(_callback && typeof(_callback === "function" )) _callback();
		}
	}

}(jQuery));