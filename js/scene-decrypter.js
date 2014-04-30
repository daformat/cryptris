/**
 *  TODO
 */

/**
 *  TODO - make this extend cryptrisSettings
 */


function specialOutInterpolator() {
    this.getPosition = function(time) {
        return {'x' : time, 'y' : 0};
    }
}

function specialInInterpolator() {
    this.getPosition = function(time) {
        return {'x' : time, 'y' : 1};
    }
}

$(function(){
  var game = cryptrisSettings;
      game.player = game.player || {};
      game.dialog4 = [false, false, false];
      game.dialogWhatArePrivatePublicKey = [false, false, false];

  var transitionTime = 1000;


  // hide .hidden elements and remove class
  $('.hidden').hide().removeClass('hidden');


    var currentGameOverData = null;

    function stopGameOverDialog() {
        $("body").closeAllDialogs(function() {});

        currentGame.director.currentScene.setPaused(false);
        currentGame.director.easeInOut(
                                    currentGame.director.getSceneIndex(currentGame.scenes.waiting_scene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    currentGame.director.getSceneIndex(currentGame.director.currentScene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE,
                                    CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    1000,
                                    true,
                                    new specialInInterpolator(),
                                    new specialOutInterpolator()
        );

        currentGame.scenes.play_max_scene.scene.setExpired(true);

        createBoardScene(currentGame.director);

        // Activate the timer.
        $(document).trigger('startTime', currentGame.scenes.play_max_scene.scene);
        launchGame();
    }

    function gameOverDialog() {

        $("body").closeAllDialogs(function() {

          $.switchWrapper('#bg-circuits', function() {
            $(".wrapper.active .vertical-centering").dialog({

                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",
          
                identifier: {
                    category: "Décrypter",
                    action: "Décryptage d'un message partagé",
                    label: "Game over (l’ordinateur a gagné)",
                },

                title: "Chercheuse",
                content: "Il faut vraiment que tu puisses décrypter ce message avant l'ordinateur. Reprennons de zéro !",
                controls: [{
                    label: "Suite",
                    class: "button blue",
                    onClick: stopGameOverDialog
                },
                {
                    label: "Abandonner",
                    class: "button red",
                    onClick: ''
                }]

            });

        });

      });
    }
    function tooManyBlocksDialog() {

        $("body").closeAllDialogs(function(){

          $.switchWrapper('#bg-circuits', function(){
            $(".wrapper.active .vertical-centering").dialog({

                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                identifier: {
                    category: "Décrypter",
                    action: "Décryptage d'un message partagé",
                    label: "Game over (le joueur ne joue pas correctement)"
                },
                title: "Chercheuse",
                content: "Pour décrypter le message tu dois détruire les blocs, tu es en train de les accumuler. Reprennons de zéro !",
                controls: [{
                    label: "Suite", 
                    class: "button blue",
                    onClick: stopGameOverDialog
                },
                {
                    label: "Abandonner",
                    class: "button red",
                    onClick: ''

                }]

            });

        });

      });
    }


    function welcome(){
        $("body").closeAllDialogs(function(){
        	$(".wrapper.active .vertical-centering").dialog({
            
          		animateText: true,
          		animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                identifier: {
                    category: 'Décrypter',
                    action: "Décryptage d'un message partagé",
                    label: "Dialogue 'Bienvenue' (Chercheuse)"
                },

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
            var before = $.now();
            createBoardScene(currentGame.director);
        	currentGame.playMaxSceneActive = false;
            currentGame.iaPlay = false;
            var after = $.now();
        	
            setTimeout(function() {
                $(".wrapper.active .vertical-centering").dialog({
	             animateText: true,
    	         animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

	              type: "withAvatar",
    	           avatar: "<img src='img/avatar-chercheuse.jpg'>",

                  identifier: {
                    category: 'Décrypter',
                    action: "Décryptage d'un message partagé",
                    label: "Dialogue 'Ta clé privée se trouve en haut' (Chercheuse)"
                },

            	  title: "Chercheuse",
            	  content: "Ta clé privée se trouve en haut. Utilise les touches <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour la manipuler selon ton envie. Appuie sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'> pour inverser ta clé et lorsque tu seras prêt, appuie sur la touche <img src='img/icn-arrow-down.png' class='keyboard-key'> pour valider ton choix.",
        	    
	               controls: [{
    	              label: "Suite", 
        	          class: "button blue",
            	   onClick: explain2
            	   }]

    	          });   
                }, 1000 + (after - before));
    	    });

    }

    function explain2(){
        $("body").closeAllDialogs(function(){
        	$(".wrapper.active .vertical-centering").dialog({
	          animateText: true,
    	      animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

	          type: "withAvatar",
    	      avatar: "<img src='img/avatar-chercheuse.jpg'>",

              identifier: {
                category: 'Décrypter',
                action: "Décryptage d'un message partagé",
                label: "Dialogue 'Lorsque deux blocs de même couleur se touchent' (Chercheuse)"
              },
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

                identifier: {
                  category: 'Décrypter',
                  action: "Décryptage d'un message partagé",
                  label: "Dialogue 'Message crypté' (InriOS)"
                },
	            title: "InriOS 3.14",
    	        content: (function(){
                    var t = board_message_to_string(currentGame.keyInfoCipher),
                        a = t.split(' '),
                        o = '';

                        for (var i = 0; i<a.length; i++) {
                            if(a[i] != '') o += "<span class='letter-block crypted crypted-message'>"+a[i]+"</span>";
                        }

                        return o;
                }()),//board_message_to_string(currentGame.cipher),
        	    
	            controls: [{
    	          label: "Ouvrir le message", 
        	      class: "button blue",
            	  onClick: launchGame
            	}]

	          });

    	    });

    }

  /**
   *  Convert seconds to Hh:Mm:Ss string
   */


  function formatSeconds(d) {
    var sign = (d<0 ? "-" : "");
    d = Math.abs(d);
    var sec_num = parseInt(d, 10); // don't forget the second parm
    var days   =  Math.floor(sec_num / 86400);
    var hours   = Math.floor((sec_num - (days * 86400)) / 3600);
    var minutes = Math.floor((sec_num - (days * 86400 + hours * 3600)) / 60);
    var seconds = sec_num - (days * 86400 + hours * 3600) - (minutes * 60);

    if (hours   < 10) { hours   = "0"+hours; }
    if (minutes < 10) { minutes = "0"+minutes; }
    if (seconds < 10) { seconds = "0"+seconds; }


    var time    = sign + (days>0 ? days+'j ' : '' ) + (days>10 ? '' : (hours == "00" ? "": hours)+(days>0 ? (hours == "00" ? "": "h ") : (hours == "00" ? "": "h ")+minutes+'m '+seconds+ 's'));
    return ( d == 0 ? '0' : time);
  }

    function launchGame() {


        ga('send', 'event', 'Décrypter', "Décryptage d'un message partagé", 'Début');
        console.log("Décrypter - Décryptage d'un message partagé - Début");

        $("body").closeAllDialogs(function(){});

        // Activate the timer.
        $(document).trigger('startTime', currentGame.scenes.play_max_scene.scene);
        currentGame.playMaxSceneActive = true;
        currentGame.iaPlay = true;
        currentGame.gameOver = false;
        // Create a timer to catch the moment we have to go to the next scene.
        var waitToContinue = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
            function(time, ttime, timerTask) {
                if ((currentGame.goToNextDialog === true && currentGame.scenes.play_max_scene.info_column.gameIsInProgress === false) || currentGame.validateCurrentBoard === true) {
                    waitToContinue.cancel();


                    if (currentGame.validateCurrentBoard === true) {
                        currentGame.validateCurrentBoard = false;
                        $(document).trigger('freezeTime', {'scene' : currentGame.scenes.play_max_scene.scene, 'timeLabel' : 'playMaxSceneActiveTime'});
                    }

                    ga('send', 'event', 'Décrypter', "Décryptage d'un message partagé", "Jeu terminé en " + formatSeconds(currentGame.playMaxSceneActiveTime));
                    console.log("Décrypter - Décryptage d'un message partagé - " + "Jeu terminé en " + formatSeconds(currentGame.playMaxSceneActiveTime));


                    currentGame.goToNextDialog = false;
                    currentGame.iaPlay = false;

                    setTimeout(onDecrypt, 1000);
                }

                if (currentGame.gameOver === true || currentGame.tooManyBlocksInAColumn === true) {
                    waitToContinue.cancel();
                    currentGame.scenes.play_max_scene.scene.setPaused(true);
                    currentGame.play_max_scene = false;
                    //currentGame.scenes.play_max_scene = null;
                    if (currentGame.gameOver === true) {
                        gameOverDialog();
                    } else if (currentGame.tooManyBlocksInAColumn === true) {
                        tooManyBlocksDialog();
                    }
                    currentGame.gameOver = false;
                    currentGame.tooManyBlocksInAColumn = false;
                }
            }
        );
    }
    function onDecrypt() {


        $("body").closeAllDialogs(function(){
            var randLetter,
                o,
                t = krDencodeEntities(easy_decrypt(currentGame.cryptedMessage));
                
                // we need to do it once more;
                t = $('<div></div>').html(t).text();


            for (var i=0; i<t.length; i++) {
                randLetter = String.fromCharCode(Math.round(Math.random()*224)+32);
                o+="<span class='letter-block crypted'>"+randLetter+"</span>";                    
            }

        	$(".wrapper.active .vertical-centering").dialog({
            
	            animateText: false,

    	        type: "withAvatar",
                avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

	            title: "InriOS 3.14",
    	        content: o, // krDencodeEntities(easy_decrypt(currentGame.cryptedMessage))
        	    
                identifier: {
                  category: 'Décrypter',
                  action: "Décryptage d'un message partagé",
                  label: "Dialogue 'Affichage du message décrypté' (InriOS)"
                },
	            controls: [{
    	          label: "Suite", 
        	      class: "button blue",
            	  onClick: lastMessage
            	}],

                // Callback functions for the different states of the dialog
                transitionCallback: {
                    in: function() {
                        // alert("Dialog was added to the dom");
                    },
                    show: function() {
                        // alert("Dialog intro animation is complete");
                        $.simulateDecrypt($(".dialog .content .text"), krDencodeEntities(easy_decrypt(currentGame.cryptedMessage)), 3);
                    },
                    out: function() {
                        // alert("Dialog outro animation is complete, html element will be removed now.");
                    }
                }

	          });   

    	    });
    }

    $.onDecrypt = onDecrypt;

/**
 *
 */

  $(document).on("playMaxSceneHelp", function() {
    // Pause the board if necessary
    if (currentGame.scenes.play_max_scene.scene.isPaused() === false) {
        currentGame.scenes.play_max_scene.scene.setPaused(true);
        currentGame.scenes.play_max_scene.needStopPaused = true;
    } else {
        currentGame.scenes.play_max_scene.needStopPaused = false;
    }
    currentGame.playMaxSceneActive = false;
    helpPlayMax();
  });

  $(document).on("playMaxScenePause", function() {
    // Pause the board if necessary
    if (currentGame.scenes.play_max_scene.scene.isPaused() === false) {
        currentGame.scenes.play_max_scene.scene.setPaused(true);
        currentGame.scenes.play_max_scene.needStopPaused = true;
    } else {
        currentGame.scenes.play_max_scene.needStopPaused = false;
    }
    currentGame.playMaxSceneActive = false;
    pausePlayMax();
  });

  function helpPlayMax() {

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){
        $(".wrapper.active .vertical-centering").dialog({
          
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,
          
          identifier: {
            category: "Décrypter",
            action: "Décryptage d'un message partagé",
            label: "Dialogue 'Aide' (Chercheuse) 1/2",
          },

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

  function pausePlayMax() {

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){
        $(".wrapper.active .vertical-centering").dialog({
          type: "player",
          title: "Pause",

          identifier: {
            category: "Décrypter",
            action: "Décryptage d'un message partagé",
            label: "Pause",
          },
          content: [
            {
                label: "Reprendre", 
                class: "not-asked",
                onClick: stopPlayMaxPause
            },
            {
                label: "Menu Principal",
                class: "not-asked",
                onClick: function() {
                    window.location.href = '/';
                }
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

              identifier: {
                category: "Décrypter",
                action: "Décryptage d'un message partagé",
                label: "Dialogue 'Aide' (Chercheuse) 2/2",
              },
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

    // Relaunch the board if necessary
    if (currentGame.scenes.play_max_scene.needStopPaused === true) {
        currentGame.scenes.play_max_scene.scene.setPaused(false);
    }
    currentGame.scenes.play_max_scene.needStopPaused = null;
    currentGame.playMaxSceneActive = true;
  }
  function stopPlayMaxPause() {
    // Close the dialog box.
    $("body").closeAllDialogs(function() {});

    // Relaunch the board if necessary
    if (currentGame.scenes.play_max_scene.needStopPaused === true) {
        currentGame.scenes.play_max_scene.scene.setPaused(false);
    }
    currentGame.scenes.play_max_scene.needStopPaused = null;
    currentGame.playMaxSceneActive = true;
  }


    function lastMessage() {

        $("body").closeAllDialogs(function(){
        	$(".wrapper.active .vertical-centering").dialog({
            
	            animateText: true,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                identifier: {
                  category: "Décrypter",
                  action: "Décryptage d'un message partagé",
                  label: "Dialogue 'Félicitations' (Chercheuse)",
                },
                title: "Chercheuse",
    	        content: 'Félicitations ! Tu as décrypté plus rapidement que l’ordinateur. Si tu veux découvrir la cryptographie, essaie de faire une nouvelle partie complète.',
        	    
	            controls: [{
    	          label: "Suite", 
        	      class: "button blue",
            	  onClick: function(){
                    window.location.href = '/';
                  }
            	}]

	          });   

    	    });
    }


	$(document).ready(function() {


    // Load the game and load assets.
    loadGame();

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

    // Adapt our crypted message to our data structure.
    currentGame.cryptedDataMessage = createADataMessage(currentGame.keyInfoCipher, currentGame.keyInfoCurrentLength);
    
    // Log event to google analytics
    ga('send', 'event', 'Décrypter', 'Renseignement du nom', 'Invite de commande');
    console.log('Décrypter - Renseignement du nom - Invite de commande');

    $("body").closeAllDialogs( function(){

    	$.switchWrapper('#new-login', function(){

	        $('#login-name').focus();

	        $('.new-login').submit(function(e){
    	      game.player.name = $('#login-name').val();
        	  currentGame.username = game.player.name !== "" ? game.player.name : 'Joueur';
              // Log event to google analytics
              ga('send', 'event', 'Décrypter', 'Renseignement du nom', 'Nom choisi : ' + currentGame.username);
              console.log('Décrypter - Renseignement du nom - Nom choisi : ' + currentGame.username);


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