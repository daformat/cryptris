$(function(){
	$('.hidden').hide().removeClass('hidden');

	var readingDelay = 4000;
	displaySecondDialog();
});

function displaySecondDialog(){
	$('.dialog .content .text').text('');
	typeLetterByLetter($('.dialog .content .text'), "Parfait <em>Mathieu</em>, ton compte est maintenant créé. Afin de sécuriser les échanges sur le réseau, nous utilisons un protocole de cryptographie asymétrique.", 20);
}