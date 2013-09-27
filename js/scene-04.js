$(function(){
	$('.dialog .content .text').text('');

	n = parseInt(getQueryString('n', 1));
	console.log(n);
	switch(n) {
		case 1:
			$('.dialog .content .text').typeLetterByLetter("Cryptographie! Du grec ancien <strong>kruptos</strong> (« caché ») et <strong>graphein</strong> (« écrire »). Il s’agit de protéger des messages.", 20);
			break;
		case 2:
			$('.dialog .content .text').typeLetterByLetter("Oui ! Asymétrique, on l’appelle aussi cryptographie à clé publique car elle repose sur l’utilisation de deux types de clés <span>:</span> la clé privée, et la clé publique. La clé publique sert à chiffrer, ou coder si tu préfères, les messages, tandis que la clé privée permet de les déchiffrer.", 20);
			break;
		default:
			$('.dialog .content .text').typeLetterByLetter("# Dialogue non-prévu pour cette option #", 20);
			break;
	}
});