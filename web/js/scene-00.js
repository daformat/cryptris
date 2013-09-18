$(function(){
	$('.hidden').hide().removeClass('hidden');

	var readingDelay = 4000;

	// First prompt
	$('.prompt .content').text('');
	typeLetterByLetter($('.prompt .content'), "Tu es stagiaire dans une équipe de recherche Inria", 20);

	// Second prompt
	setTimeout(function(){
		$('.prompt .content').text('');
		typeLetterByLetter($('.prompt .content'), "Premier jour à l'institut", 20);

		// Switch to institute
		setTimeout(function(){
			switchWrapper('.bg-institut');
		}, readingDelay);

	}, readingDelay);

});

function switchWrapper(sel){
	$('.wrapper.active').fadeOut(function(){
		setTimeout(function(){$(sel).fadeIn().addClass('active'); displayFirstDialog();}, 1000);
	});
}

function displayFirstDialog(){
	$('.dialog .content .text').text('');
	typeLetterByLetter($('.dialog .content .text'),"Bienvenue à l’Institut ! C’est donc toi mon nouvel apprenti, parfait ! Commençons par le commencement, il te faudra un compte utilisateur pour te connecter au réseau, tu n’as qu’à choisir ton nom d’utilisateur.", 20);
}