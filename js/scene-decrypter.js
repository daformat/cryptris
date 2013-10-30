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


    function welcome(){
        $("body").closeAllDialogs(function(){
        	$(".wrapper.active .vertical-centering").dialog({
            
          		animateText: true,
          		animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

	            type: "withAvatar",
      		    avatar: "<img src='img/avatar-chercheuse.jpg'>",

          		title: "Chercheuse",
    	        content: "Bonjour"+( game.player.name ? " <em>"+game.player.name+"</em>" : "" ) + ", bienvenue à l'INRIA. Tu as en ta possession un message crypté, laisse-moi t'expliquer comment le décrypter. ",
        	    
	            controls: [{
    	          label: "Suite", 
        	      class: "button blue",
            	  onClick: explain1
            	}]

	          });   

    	    });

    }

    function explain1(){
        $("body").closeAllDialogs(function(){
        	loadGame();
        	currentGame.playMaxSceneActive = false;
        	$(".wrapper.active .vertical-centering").dialog({
	          animateText: true,
    	      animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

	          type: "withAvatar",
    	      avatar: "<img src='img/avatar-chercheuse.jpg'>",

        	  title: "Chercheuse",
        	  content: "Ta clé privée se trouve en haut. Utilise les touches <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour la manipuler selon ton envie. Appuie sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'> pour inverser ta clé et lorsque tu seras prêt, appuie sur la touche <img src='img/icn-arrow-down.png' class='keyboard-key'> pour valider ton choix.",
        	    
	            controls: [{
    	          label: "Suite", 
        	      class: "button blue",
            	  onClick: explain2
            	}]

	          });   

    	    });

    }

    function explain2(){
        $("body").closeAllDialogs(function(){
        	$(".wrapper.active .vertical-centering").dialog({
	          animateText: true,
    	      animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

	          type: "withAvatar",
    	      avatar: "<img src='img/avatar-chercheuse.jpg'>",

        	  title: "Chercheuse",
        	  content: "Lorsque deux blocs de même couleur se touchent : ils s'additionnent, sinon ils se détruisent. Ton message est décrypté lorsqu'il ne reste qu'une seule ligne au message. A toi de jouer !",
        	    
	            controls: [{
    	          label: "Suite", 
        	      class: "button blue",
            	  onClick: displayMessage
            	}]

	          });   

    	    });

    }

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

    function launchGame() {

        $("body").closeAllDialogs(function(){});

        currentGame.playMaxSceneActive = true;
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
    function onDecrypt() {

        $("body").closeAllDialogs(function(){
        	$(".wrapper.active .vertical-centering").dialog({
            
	            animateText: true,

    	        type: "withAvatar",
                avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

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

  $(document).on("playMasSceneHelp", function() {
    // Pause the board
    currentGame.scenes.play_max_scene.scene.setPaused(true);
    currentGame.playMaxSceneActive = false;
    helpPlayMax();
  });

  function helpPlayMax() {

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){
        $(".wrapper.active .vertical-centering").dialog({
          
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='img/avatar-chercheuse.jpg'>",

          title: "Chercheuse",
          content: "Ta clé privée se trouve en haut. Utilise les touches <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour la manipuler selon ton envie. Appuie sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'> pour inverser ta clé et lorsque tu seras prêt, appuie sur la touche <img src='img/icn-arrow-down.png' class='keyboard-key'> pour valider ton choix.",
          controls: [{
            label: "Suite", 
            class: "button blue",
            onClick: helpPlayMax2
          }]

        });
  

      });

    });
  }

    function helpPlayMax2(){
        $("body").closeAllDialogs(function(){
        	$(".wrapper.active .vertical-centering").dialog({
	          animateText: true,
    	      animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

	          type: "withAvatar",
    	      avatar: "<img src='img/avatar-chercheuse.jpg'>",

        	  title: "Chercheuse",
        	  content: "Lorsque deux blocs de même couleur se touchent : ils s'additionnent, sinon ils se détruisent. Ton message est décrypté lorsqu'il ne reste qu'une seule ligne au message. A toi de jouer !",
        	    
	            controls: [{
    	          label: "Suite", 
        	      class: "button blue",
            	  onClick: stopPlayMaxHelp
            	}]

	          });   

    	    });

    }

  function stopPlayMaxHelp() {
    // Close the dialog box.
    $("body").closeAllDialogs(function() {});

    // Relaunch the board.
    currentGame.scenes.play_max_scene.scene.setPaused(false);
    currentGame.playMaxSceneActive = true;
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
	          $.switchWrapper('#bg-circuits', welcome);
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