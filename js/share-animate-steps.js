/**
 *	Animate the transition between the different 'sharing' steps
 *	@author: Mathieu Jouhet <mathieu@digitalcuisine.fr>
 */

$(function(){
	
	// Move step1 out and animate step2 in
	$("#share").submit(function(){
		$("#step1").animate({marginLeft: "-200%"});
		$("#step2").animate({marginLeft: "0%"});

	  ga('send', 'event', 'Partager', 'Chiffrer le message', $("textarea").val());


		return false;
	});

	// Animate step1 back in and move step2 out
	$("#step2 .button.red").click(function(){
		$("#step1").animate({marginLeft: "0%"});
		$("#step2").animate({marginLeft: "200%"});
	});


});