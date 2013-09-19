(function($){

	var tag, n, s, nn;

	$.fn.typeLetterByLetter = function(text, speed){
		s = $('<div>').append(text).text().length;
		tag = false;
		n = 0;
		typeAnother(this, text, speed);
		return this;
	}

	var typeAnother = function ($e, text, speed){
		nn = $e.text().length;

		if(nn < s) {
			c = text.substr(n, 1)

			if ( c == '<') tag = true; 
			else if ( c == '>') tag = false; 

			$e.html(text.substr(0, n++));
			
			if(tag)
				typeAnother($e, text, speed);
			else
				setTimeout(function(){typeAnother($e, text, speed)}, speed);
		}

	}

}(jQuery));