$(function(){
	$('.hidden').hide().removeClass('hidden');

	var readingDelay = 4000;
	displaySecondDialog();
});

function displaySecondDialog(){
	$('.dialog .content .text').text('');
	$('.dialog .content .text').typeLetterByLetter("Parfait <em>"+getQueryString("name","Nom du joueur")+"</em>, ton compte est maintenant créé. Afin de sécuriser les échanges sur le réseau, nous utilisons un protocole de cryptographie asymétrique.", 20);
}