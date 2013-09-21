$(function(){
	$('.dialog .content .text').text('');
	$('.dialog .content .text').typeLetterByLetter('Voici ta clé privée, tu peux la manipuler à l’aide des touches<br/> <img src="img/icn-arrow-left.png" class="keyboard-key"> et <img src="img/icn-arrow-right.png"  class="keyboard-key"> de ton clavier pour en décaler les colonnes. Tu peux aussi inverser les colonnes avec <img src="img/icn-arrow-up.png" class="keyboard-key"> ou <img src="img/icn-space.png" class="keyboard-key">. Quand tu auras fini, appuie sur <img src="img/icn-arrow-down.png" class="keyboard-key"> pour générer ta clé publique.', 20, function(){retina()});
});
