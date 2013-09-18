function typeLetterByLetter ($e, text, speed){
	s = text.length;
	n = $e.text().length;
	if(n<s) {
		$e.text($e.text()+text.charAt(n));
		setTimeout(function(){typeLetterByLetter($e, text, speed)}, speed);
	}
}
