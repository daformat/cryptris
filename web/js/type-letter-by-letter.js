(function($){

	var tag, n, s, nn, _callback;

	$.fn.typeLetterByLetter = function(text, speed, callback){
		s = $('<div>').append(text).text().length;
		tag = false;
		n = 0;
		typeAnother(this, text, speed);

		_callback = callback;

		return this;
	}

	var typeAnother = function ($e, text, speed){
		nn = $e.text().length;

		if(nn < s) {
			c = text.substr(n, 1)

			if ( c == '<') tag = true; 
			else if ( c == '>') tag = false; 

			$e.html(text.substr(0, ++n));
			
			if(tag === true){
				typeAnother($e, text, speed);
				//console.log("In tag")
			}
			else
				setTimeout(function(){typeAnother($e, text, speed)}, speed);
		} else { 
			if(_callback && typeof(_callback === "function" )) _callback();
		}
	}

}(jQuery));