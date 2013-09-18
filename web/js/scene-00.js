$(function(){
	$('.prompt .content').text('');
	typeLetterByLetter($('.prompt .content'), "Tu es stagiaire dans une équipe de recherche Inria", 20);
	setTimeout(function(){
		$('.prompt .content').text('');
		typeLetterByLetter($('.prompt .content'), "Premier jour à l'institut", 20);
	}, 4000);
});