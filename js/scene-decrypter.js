var cryptrisSettings = {
    readingDelay: 4000,
    animateTextDelayBetweenLetters: 20,
    player: {},
    dialog4: [false, false, false],
    dialogWhatArePrivatePublicKey: [false, false, false]
}

$(function(){
  var game = cryptrisSettings;
  var transitionTime = 1000;


  // hide .hidden elements and remove class
  $('.hidden').hide().removeClass('hidden');

    function displayMessage(){
        $("body").closeAllDialogs(function(){
        	$(".wrapper.active .vertical-centering").dialog({
            
	            animateText: true,

    	        type: "withAvatar",
        	    avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

	            title: "InriOS 3.14",
    	        content: board_message_to_string(currentGame.keyInfoCipher),//board_message_to_string(currentGame.cipher),
        	    
	            controls: [{
    	          label: "Ouvrir le message", 
        	      class: "button blue",
            	  onClick: launchGame
            	}]

	          });   

    	    });

    }

    function onDecrypt() {

        $("body").closeAllDialogs(function(){
        	$(".wrapper.active .vertical-centering").dialog({
            
	            animateText: true,

    	        type: "withAvatar",
        	    avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

	            title: "InriOS 3.14",
    	        content: krDencodeEntities(easy_decrypt(currentGame.cryptedMessage)),
        	    
	            controls: [{
    	          label: "Suite", 
        	      class: "button blue",
            	  onClick: lastMessage
            	}]

	          });   

    	    });
    }

    function lastMessage() {

        $("body").closeAllDialogs(function(){
        	$(".wrapper.active .vertical-centering").dialog({
            
	            animateText: true,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                title: "Chercheuse",
    	        content: 'A COMPLETER',
        	    
	            controls: [{
    	          label: "Suite", 
        	      class: "button blue",
            	  onClick: lastMessage
            	}]

	          });   

    	    });
    }

    function launchGame() {

        $("body").closeAllDialogs(function(){});
        loadGame();

        // Create a timer to catch the moment we have to go to the next scene.
        var waitToContinue = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
            function(time, ttime, timerTask) {
                if (currentGame.goToNextDialog === true) {
                    waitToContinue.cancel();
                    currentGame.goToNextDialog = false;

                    setTimeout(onDecrypt, 1000);
                }
            }
        );
    }

	$(document).ready(function() {

    /**
     * Get info from url.
     */
    var data = getQuerystring('data', '');

    var dataElement = data.split('-');
    var keyInfo = keyInfoDeCrypt(dataElement[1]);
    currentGame.cryptedMessage = dataElement[0];

    var keyInfoElement = keyInfo.split('|');

    currentGame.keyInfoPublicKey = keyInfoElement[0].split(',').map(Number);
    currentGame.keyInfoPrivateKey = keyInfoElement[1].split(',').map(Number);
    currentGame.keyInfoCipher = keyInfoElement[2].split(',').map(Number);
    currentGame.keyInfoCurrentLength = parseInt(keyInfoElement[3]);

	    $("body").closeAllDialogs( function(){

    	  $.switchWrapper('#new-login', function(){

	        $('#login-name').focus();

	        $('.new-login').submit(function(e){
    	      game.player.name = $('#login-name').val();
        	  currentGame.username = game.player.name !== "" ? game.player.name : 'Joueur';
	          $.switchWrapper('#bg-circuits', displayMessage);
    	      $('#login-name').blur();
        	  $('.new-login').unbind('submit').submit(function(e){
	            return false;
    	      });
        	  return false;
	        });
	      });

	    });
	});

});