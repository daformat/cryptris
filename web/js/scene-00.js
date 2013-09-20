$(function(){
	$('.hidden').hide().removeClass('hidden');

	var readingDelay = 4000;

	// First prompt
	$('.prompt .content').text('');
	setTimeout(function(){
		$('.prompt .content').typeLetterByLetter("Tu es stagiaire dans une équipe de recherche Inria", 60, function(){
		// Second prompt
			setTimeout(function(){
				$('.prompt .content').text('');
				setTimeout(function(){
					$('.prompt .content').typeLetterByLetter( "Premier jour à l'institut", 60, function(){
						// Switch to institute
						setTimeout(function(){
							switchWrapper('.bg-institut');
						}, readingDelay);						
					});
				}, 2000)
			}, readingDelay);

		});
	}, 3000);			
});

function switchWrapper(sel){
	$('.wrapper.active').fadeOut(function(){
		setTimeout(function(){$(sel).fadeIn().addClass('active'); displayFirstDialog();}, 1000);
	});
}

function displayFirstDialog(){
	$('.dialog .content .text').text('');
	$('.dialog .content .text').typeLetterByLetter("Bienvenue à l’Institut ! C’est donc toi mon nouvel apprenti, parfait ! Commençons par le commencement, il te faudra un compte utilisateur pour te connecter au réseau, tu n’as qu’à choisir ton nom d’utilisateur.", 20);
}