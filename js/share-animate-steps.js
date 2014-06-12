/**
 *	Animate the transition between the different 'sharing' steps
 *	@author: Mathieu Jouhet <mathieu@digitalcuisine.fr>
 */

$(function(){
	var $t = $('#share textarea'),
		timeouts = [],
		clearTimeouts = function () {
			$.each(timeouts, function(i){
				clearTimeout(timeouts[i])
			});

			timeouts = [];
		};

	$t.jrumble({
		x: 16,
		y: 0,
		rotation: 0,
		speed: 1
	});		

	// Move step1 out and animate step2 in only if the message length
	// is less than cryptrisSettings.socialEncryptedMessageMaxLength value
	// and more than 0
	$("#share").submit(function(){
		var v = $t.val();
    	clearTimeouts();

        if(v.length <= cryptrisSettings.socialEncryptedMessageMaxLength && v.length > 0){
			$("#step1").animate({marginLeft: "-200%"});
			$("#step2").animate({marginLeft: "0%"});

			// log to google analytics
			ga('send', 'event', 'Partager', 'Chiffrer le message', $("textarea").val());

		} else {
			$t.trigger('startRumble');
			timeouts.push(window.setTimeout(function(){
				$('#share textarea').trigger('stopRumble')
			}, 1000));
		}

		return false;
	});

	// Animate step1 back in and move step2 out
	$("#step2 .button.red").click(function(){
		$("#step1").animate({marginLeft: "0%"});
		$("#step2").animate({marginLeft: "200%"});
	});

});