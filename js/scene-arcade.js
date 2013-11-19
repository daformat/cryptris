var cryptrisSettings = {
  readingDelay: 4000,
  animateTextDelayBetweenLetters: 20,
  player: {}
}

$(function(){

  var game = cryptrisSettings;
  var transitionTime = 1000;

  // hide .hidden elements and remove class
  $('.hidden').hide().removeClass('hidden');

  function getName(level, isCK) {
    $("body").closeAllDialogs( function(){
      $.switchWrapper('#new-login', function(){
        $('#login-name').focus();
        $('.new-login').submit(function(e){
          game.player.name = $('#login-name').val();
          currentGame.username = game.player.name !== "" ? game.player.name : 'Joueur';
          isCK ? level() : firstDialog(level);
          $('#login-name').blur();
          $('.new-login').unbind('submit').submit(function(e){
            return false;
          });
          return false;
        });
      });
    });
  }


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

  function announcePublicKey(){
    // -- Change the behavior when we have a 'resolved message' on create key screen.
    currentGame.stopCreateKeyAfterResolve = false;

    // -- switch to waiting scene.
    currentGame.director.easeInOut(
                                    currentGame.director.getSceneIndex(currentGame.scenes.waiting_scene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    currentGame.director.getSceneIndex(currentGame.director.currentScene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE,
                                    CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    0,
                                    true,
                                    new specialInInterpolator(),
                                    new specialOutInterpolator()
    );

    $("body").closeAllDialogs(function(){
      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='img/avatar-chercheuse.jpg'>",

          title: "Chercheuse",
          content: "Tu vas créer ta paire de clé privée / clé publique mais<span>...</span> n’oublie pas, cette clé privée est... privée ! Toi seul dois la connaître ! Ta clé publique sera diffusée sur le réseau à l’ensemble des chercheurs de l’Institut.",
                
          controls: [{
            label: "Suite", 
            class: "button blue",
            onClick: dialog6
          }]

        });   
            
      });

    });

  }

  function dialog6(){

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){
        // Set the createKeyScene as the current scene.
        currentGame.director.easeInOut(
                                        currentGame.director.getSceneIndex(currentGame.scenes.create_key_scene.scene),
                                        CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                        currentGame.director.getSceneIndex(currentGame.director.currentScene),
                                        CAAT.Foundation.Scene.prototype.EASE_SCALE,
                                        CAAT.Foundation.Actor.ANCHOR_CENTER,
                                        transitionTime, true,
                                        new specialInInterpolator(),
                                        new specialOutInterpolator()
        );

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='img/avatar-chercheuse.jpg'>",

          title: "Chercheuse",
          content: "Voici ta clé privée, utilise les touches <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour la manipuler selon ton envie. Appuie sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'> pour inverser ta clé et lorsque tu seras prêt, appuie sur la touche <img src='img/icn-arrow-down.png' class='keyboard-key'> pour valider ton choix.",

          controls: [{
            label: "Suite", 
            class: "button blue",
            onClick: switchToCreateKey
          }]
        });
      });
    });
  }

  function activateHelp(dataScene, hookName, helpFunction) {
    if (dataScene.scene.isPaused() === false) {
      dataScene.scene.setPaused(true);
      dataScene.needStopPaused = true;
    } else {
      dataScene.needStopPaused = false;
    }
    currentGame[hookName] = false;


    var helpInfo = {
      'sceneName' : dataScene,
      'hookName' : hookName
    };
    helpFunction(helpInfo);
  }

  function deActivateHelp(dataScene, hookName) {
    $("body").closeAllDialogs(function() {});

    // Relaunch the board if necessary.
    if (dataScene.needStopPaused === true) {
      dataScene.scene.setPaused(false);
    }
    dataScene.needStopPaused = null;
    currentGame[hookName] = true;
  }

  $(document).on("helpCreateKeyEvent", function() {
    activateHelp(currentGame.scenes.create_key_scene, "createKeySceneActive", helpCreateKey);
  });

  function helpCreateKey() {

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){
        $(".wrapper.active .vertical-centering").dialog({
          
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='img/avatar-chercheuse.jpg'>",

          title: "Chercheuse",
          content: "Help CREATE_KEY",
          controls: [{
            label: "Suite", 
            class: "button blue",
            onClick: function() {
              deActivateHelp(currentGame.scenes.create_key_scene, "createKeySceneActive");
            }
          }]

        });
  

      });

    });
  }

  function switchToCreateKey() {
    $("body").closeAllDialogs();
    // Enable the action on the key.
    currentGame.createKeySceneActive = true;

    // Add a timer to handle the first move.
    var timerFirstMove = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
      function(time, ttime, timerTask) {
        /* Set here the number you want make sure that it's inferior at currentGame.maxNewKeyMove in global.js*/
        if (currentGame.scenes.create_key_scene.game_box.crypt_key.numberApplied === 1) {
          timerFirstMove.cancel();
          // Uncomment me for disable input entry.
          currentGame.createKeySceneActive = false;

          // call the function you want here
          dialogNowTryToCancelLastMove();
        }
      }
    );

    var waitToContinue = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
      function(time, ttime, timerTask) {
        if (currentGame.scenes.create_key_scene.game_box.crypt_key.numberApplied === currentGame.maxNewKeyMove) {
          waitToContinue.cancel();
          currentGame.createKeySceneActive = false;
          dialog6KeyPreGenerated();
        }
      }
    );
  }

  function dialogPleaseInvertYourPrivateKey() {

    // Add a timer to handle the action after this dialog box.
    var timerSecondMove = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
      function(time, ttime, timerTask) {
        var crypt_key = currentGame.scenes.create_key_scene.game_box.crypt_key;
        /* Set here the number you want make sure that it's inferior at currentGame.maxNewKeyMove in global.js*/
        if (crypt_key.numberApplied === 3) {
          timerSecondMove.cancel();
          // Uncomment me for disable input entry.
          currentGame.createKeySceneActive = false;

          if (crypt_key.last_move[crypt_key.last_move.length - 1][0] === 0 && crypt_key.last_move[crypt_key.last_move.length - 1][1] === true) {
            // call the function you want here
            dialogContinueManipulatingToGeneratePublicKey();
          } else {
            dialogOkDontInvertYourPrivateKey();
          }
        }
      }
    );

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({
          
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='img/avatar-chercheuse.jpg'>",

          title: "Chercheuse",
          content: "Tu n'as pas annulé ton précédent mouvement. Essaye de le faire en appuyant sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou sur <img src='img/icn-space.png' class='keyboard-key'> afin d'inverser les couleurs de ta clé. Puis, appuie sur <img src='img/icn-arrow-down.png' class='keyboard-key'> pour envoyer ta clé.</span>",

          controls: [{
            label: "Suite", 
            class: "button blue",
            onClick: function(){
              $('body').closeAllDialogs(function(){
                currentGame.createKeySceneActive = true;
              });
            }
          }]

        });
  

      });

    });

  }

  function dialogOkDontInvertYourPrivateKey() {

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({
          
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='img/avatar-chercheuse.jpg'>",

          title: "Chercheuse",
          content: "Ok, tu ne veux pas annuler ton précédent mouvement. Alors continue de manipuler ta clé privée afin d’entamer la création de ta clé publique",

          controls: [{
            label: "Suite", 
            class: "button blue",
            onClick: function(){
              $('body').closeAllDialogs(function(){
                currentGame.createKeySceneActive = true;
              });
            }
          }]

        });
  

      });

    });

  }
  
  function dialogNowTryToCancelLastMove(){
    currentGame.createKeySceneActive = false;
        
    // Add a timer to handle the action after this dialog box.
    var timerSecondMove = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
      function(time, ttime, timerTask) {
        var crypt_key = currentGame.scenes.create_key_scene.game_box.crypt_key;
        /* Set here the number you want make sure that it's inferior at currentGame.maxNewKeyMove in global.js*/
        if (crypt_key.numberApplied === 2) {
          timerSecondMove.cancel();
          // Uncomment me for disable input entry.
          currentGame.createKeySceneActive = false;

          if (crypt_key.last_move[crypt_key.last_move.length - 1][0] === 0 && crypt_key.last_move[crypt_key.last_move.length - 1][1] === true) {
            // call the function you want here
            dialogContinueManipulatingToGeneratePublicKey();
          } else {
            dialogPleaseInvertYourPrivateKey();
          }
        }
      }
    );

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='img/avatar-chercheuse.jpg'>",

          title: "Chercheuse",
          content: "Parfait ! Essaie maintenant d'annuler ton dernier mouvement en appuyant sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou sur <img src='img/icn-space.png' class='keyboard-key'> afin d'inverser les couleurs de ta clé. Puis, appuie sur <img src='img/icn-arrow-down.png' class='keyboard-key'> pour envoyer ta clé.</span>",

          controls: [{
            label: "Suite", 
            class: "button blue",
            onClick: function(){
              $('body').closeAllDialogs(function(){
                currentGame.createKeySceneActive = true;
              });
            }
          }]

        });
    

      });

    });

  }

  function dialogContinueManipulatingToGeneratePublicKey() {
    currentGame.createKeySceneActive = false;
        
    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='img/avatar-chercheuse.jpg'>",

          title: "Chercheuse",
          content: "Continue à présent de manipuler ta clé privée afin d’entamer la création de ta clé publique",

          controls: [{
            label: "Suite", 
            class: "button blue",
            onClick: function(){
              $('body').closeAllDialogs(function(){
                currentGame.createKeySceneActive = true;
              });
            }
          }]

        });
      });

    });

  }       

  function dialog6KeyPreGenerated() {
    $("body").closeAllDialogs(function() {

      $.switchWrapper('#bg-circuits', function() {

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='img/avatar-chercheuse.jpg'>",

          title: "Chercheuse",
          content: "Très bien, tu as compris ! L'ordinateur va à présent terminer de générer ta clé publique.",

          controls: [{
            label: "Suite", 
            class: "button blue",
            onClick: switchToFinishCreateKey
          }]

        });
      });
    });
  }

  function switchToFinishCreateKey() {
    $("body").closeAllDialogs();
    // Launch the ia.
    currentGame.scenes.create_key_scene.game_box.boxOption.timeInfo = createKeyIASceneTime;
    ia_create_pk(currentGame.scenes.create_key_scene.scene, currentGame.scenes.create_key_scene.game_box);

    var waitToContinue = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
      function(time, ttime, timerTask) {
        if (currentGame.goToNextDialog === true) {
          waitToContinue.cancel();
          currentGame.goToNextDialog = false;
          currentGame.createKeySceneActive = false;

          // Disable the action on the key.
          setTimeout(function() {

            currentGame.director.easeInOut(
              currentGame.director.getSceneIndex(currentGame.scenes.waiting_scene),
              CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
              currentGame.director.getSceneIndex(currentGame.scenes.create_key_scene.scene),
              CAAT.Foundation.Scene.prototype.EASE_SCALE,
              CAAT.Foundation.Actor.ANCHOR_CENTER,
              transitionTime,
              true,
              new specialInInterpolator(),
              new specialOutInterpolator()
            );
            endCreateKey();
            currentGame.dontShowKey = false;
          }, 2000);
        }
      }
    );
  }

  function endCreateKey(){
    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='img/avatar-chercheuse.jpg'>",

          title: "Chercheuse",
          content: "Parfait ! Te voilà fin prêt! J’ai bien ta clé publique, nous pouvons passer à la suite.",
                
          controls: [{
            label: "Menu principal",
            class: "button red",
            onClick: menu
          },
          {
            label: "Suite", 
            class: "button blue",
            onClick: challenge1
          }]

        });   

      });

    });

  }

  $.goToBattleScene = goToBattleScene;
  var currentGameOverData = null;

  function stopGameOverDialog() {
    var saveScene = currentGame.scenes[currentGameOverData.sceneName].scene;
    goToBattleScene(currentGameOverData.sceneName, currentGameOverData.onDecrypt, currentGameOverData.sizeBoard, currentGameOverData.hookName, currentGameOverData.withIaBoard, currentGameOverData.timeInfo, currentGameOverData.message, currentGameOverData.helpEvent, currentGameOverData.timeout);
    saveScene.setExpired(true);
    $("body").closeAllDialogs(function() {});
    currentGame.scenes[currentGameOverData.sceneName].scene.setPaused(false);
    currentGame.scenes[currentGameOverData.sceneName].add_key_symbol(currentGame.director, currentGame.scenes[currentGameOverData.sceneName]);
    currentGame[currentGameOverData.hookName] = true;
    currentGame.iaPlay = true;
  }

  function gameOverDialog() {

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){
        $(".wrapper.active .vertical-centering").dialog({

          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='img/avatar-chercheuse.jpg'>",

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

  function goToBattleScene(sceneName, onDecrypt, sizeBoard, hookName, withIaBoard, timeInfo, message, helpEvent, timeout) {

    // Prepare the sceneName and set it as the current scene.
    preparePlayScene(currentGame.director, sizeBoard, sceneName, message, hookName, withIaBoard, helpEvent);
    currentGame.iaPlay = false;
    currentGame[hookName] = false;
    currentGame.gameOver = false;
    currentGame.tooManyBlocksInAColumn = false;

    currentGame.director.currentScene.setPaused(false);
    currentGame.director.easeInOut(currentGame.director.getSceneIndex(currentGame.scenes[sceneName].scene), CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                   currentGame.director.getSceneIndex(currentGame.director.currentScene), CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER, transitionTime, true,
                                   new specialInInterpolator(), new specialOutInterpolator());
        
    setTimeout(function() {currentGame.scenes[sceneName].add_key_symbol(currentGame.director, currentGame.scenes[sceneName])}, 500);

    // set the speed of this scene.
    timeInfo && withIaBoard ? currentGame.scenes[sceneName].rival_box.boxOption.timeInfo = timeInfo : null;

    // Create a timer to catch the moment we have to go to the next scene.
    var waitToContinue = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
      function(time, ttime, timerTask) {
        if (currentGame.goToNextDialog === true) {
          waitToContinue.cancel();
          currentGame.goToNextDialog = false;
          currentGame[hookName] = false;
          timeout ? setTimeout(onDecrypt, timeout) : onDecrypt();
        }
        if (currentGame.gameOver === true || currentGame.tooManyBlocksInAColumn === true) {
          waitToContinue.cancel();
          currentGame.scenes[sceneName].scene.setPaused(true);
          currentGame[hookName] = false;

          currentGameOverData = {
            'sceneName' : sceneName,
            'onDecrypt' : onDecrypt,
            'sizeBoard' : sizeBoard,
            'hookName' : hookName,
            'withIaBoard' : withIaBoard,
            'timeInfo' : timeInfo,
            'message' : message,
            'helpEvent' : helpEvent,
            'timeout' : timeout
          };
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

  function challenge1(){
    $("body").closeAllDialogs(function(){

      // Prepare the first battle message
      currentGame.play_min_scene_msg = createMessageForPlayScene(MIN_BOARD_LENGTH, FIRST_CHALLENGE_MESSAGE);
      // Display the battle scene in background.
      goToBattleScene('play_min_scene', dialogDecryptedMessage1, MIN_BOARD_LENGTH, 'playMinSceneActive', true, false, currentGame.play_min_scene_msg, 'playMinHelpEvent');

      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "InriOS 3.14",
          content: board_message_to_string(currentGame.play_min_scene_msg.plain_message),
                
          controls: [{
            label: "Décrypter le message", 
            class: "button blue",
            onClick: playLevel1
          }]

        });   

      });

    });

  }

  function helpDialog1(helpInfo){
    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='img/avatar-chercheuse.jpg'>",

          title: "Chercheuse",
          content: "Chaque challenge est crypté à l’aide de ta <em>clé publique</em>, pour le décrypter tu dois utiliser ta <em>clé privée.</em> Manipule ta clé comme tout à l’heure avec <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour déplacer les colonnes et <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'>. pour inverser les couleurs des blocs.",
          controls: [{
            label: "Suite", 
            class: "button blue",
            onClick: function() {
              helpDialog2(helpInfo);
            }
          }]
        });   
      });
    });
  }

  function helpDialog2(helpInfo) {
    $("body").closeAllDialogs(function(){

      // Launch the timer and display private key.

      $(".wrapper.active .vertical-centering").dialog({

        animateText: true,
        animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

        type: "withAvatar",
        avatar: "<img src='img/avatar-chercheuse.jpg'>",

        title: "Chercheuse",
        content: "Lorsque tu appuies sur <img src='img/icn-arrow-down.png' class='keyboard-key'> ta clé est envoyée sur le message à décrypter et les blocs vont s’annuler s’ils sont de couleurs opposées ou s’empiler s’ils sont de même couleur. Le message est décrypté lorsque tu n’as plus qu’une seule ligne de blocs en bas. À toi de jouer !",
        controls: [{
          label: "Suite", 
          class: "button blue",
          onClick: function() {
            deActivateHelp(helpInfo.sceneName, helpInfo.hookName);
          }
        }]

      });   

    });

  }

  $(document).on("playMinHelpEvent", function() {
    activateHelp(currentGame.scenes.play_min_scene, "playMinSceneActive", helpDialog1);
  });

  function playLevel1(){
    $("body").closeAllDialogs(function(){
      // Active input for play_min_scene
      currentGame.iaPlay = true;
      currentGame.scenes.play_min_scene.scene.setPaused(false);
      currentGame.playMinSceneActive = true;
    });
  }


  function dialogDecryptedMessage1(){
    $("body").closeAllDialogs(function() {

      $.switchWrapper('#bg-circuits', function() {

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "Challenge réussi",
          content: "Premier challenge décrypté : " + FIRST_CHALLENGE_MESSAGE,
                
          controls: [{
            label: "Menu principal",
            class: "button red",
            onClick: menu
          },{
            label: "Challenge suivant", 
            class: "button blue",
            onClick: challenge2
          }]

        });   

      });

    });

  }       























  function challenge2(){
    $("body").closeAllDialogs(function(){

      // Prepare the second battle message
      currentGame.play_medium_scene_msg = createMessageForPlayScene(MEDIUM_BOARD_LENGTH, SECOND_CHALLENGE_MESSAGE);


      // Display the battle scene in background.
      goToBattleScene('play_medium_scene', dialogDecryptedMessage2, MEDIUM_BOARD_LENGTH, 'playMediumSceneActive', true, false, currentGame.play_medium_scene_msg, 'playMediumHelpEvent');

      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "InriOS 3.14",
          content: board_message_to_string(currentGame.play_medium_scene_msg.plain_message),
                
          controls: [{
            label: "Décrypter le message", 
            class: "button blue",
            onClick: playLevel2
          }]

        });   

      });

    });

  }

  $(document).on("playMediumHelpEvent", function() {
    activateHelp(currentGame.scenes.play_medium_scene, "playMediumSceneActive", helpDialog1);
  });


  function playLevel2(){
    $("body").closeAllDialogs(function(){
      // Active input for play_medium_scene
      currentGame.iaPlay = true;
      currentGame.scenes.play_medium_scene.scene.setPaused(false);
      currentGame.playMediumSceneActive = true;
    });
  }


  function dialogDecryptedMessage2(){
    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "Challenge réussi",
          content: "Deuxième challenge décrypté : " + SECOND_CHALLENGE_MESSAGE,
                
          controls: [{
            label: "Menu principal",
            class: "button red",
            onClick: menu
          },{
            label: "Challenge suivant", 
            class: "button blue",
            onClick: challenge3
          }]

        });   
      });
    });
  }













  function challenge3(){
    $("body").closeAllDialogs(function(){

      // Prepare the second battle message
      currentGame.play_max_scene_msg = createMessageForPlayScene(MAX_BOARD_LENGTH, THIRD_CHALLENGE_MESSAGE);


      // Display the battle scene in background.
      goToBattleScene('play_max_scene', dialogDecryptedMessage3, MAX_BOARD_LENGTH, 'playMaxSceneActive', true, false, currentGame.play_max_scene_msg, 'playMaxHelpEvent');

      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({

          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "InriOS 3.14",
          content: board_message_to_string(currentGame.play_max_scene_msg.plain_message),
            
          controls: [{
            label: "Décrypter le message", 
            class: "button blue",
            onClick: playLevel3
          }]

        });   

      });

    });

  }

  $(document).on("playMaxHelpEvent", function() {
    activateHelp(currentGame.scenes.play_max_scene, "playMaxSceneActive", helpDialog1);
  });


  function playLevel3(){
    $("body").closeAllDialogs(function(){
      // Active input for play_max_scene
      currentGame.iaPlay = true;
      currentGame.scenes.play_max_scene.scene.setPaused(false);
      currentGame.playMaxSceneActive = true;
    });
  }


  function dialogDecryptedMessage3(){
    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "Challenge réussi",
          content: "Troisième challenge décrypté : " + THIRD_CHALLENGE_MESSAGE,
                
          controls: [{
            label: "Menu principal",
            class: "button red",
            onClick: menu
          },{
            label: "Challenge suivant", 
            class: "button blue",
            onClick: challenge4
          }]

        });   

      });

    });

  }       



















  function challenge4(){
    $("body").closeAllDialogs(function(){

      // Prepare the second battle message
      currentGame.play_super_max_scene_msg = createMessageForPlayScene(SUPER_MAX_BOARD_LENGTH, FOURTH_CHALLENGE_MESSAGE);

      // Display the battle scene in background.
      goToBattleScene('play_super_max_scene', dialogDecryptedMessage4, SUPER_MAX_BOARD_LENGTH, 'playSuperMaxSceneActive', true, false, currentGame.play_super_max_scene_msg, 'playSuperMaxHelpEvent');

      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "InriOS 3.14",
          content: board_message_to_string(currentGame.play_super_max_scene_msg.plain_message),
                
          controls: [{
            label: "Décrypter le message", 
            class: "button blue",
            onClick: playLevel4
          }]

        });   

      });

    });

  }

  $(document).on("playSuperMaxHelpEvent", function() {
    activateHelp(currentGame.scenes.play_super_max_scene, "playSuperMaxSceneActive", helpDialog1);
  });


  function playLevel4(){
    $("body").closeAllDialogs(function(){
      // Active input for play_super_max_scene
      currentGame.iaPlay = true;
      currentGame.scenes.play_super_max_scene.scene.setPaused(false);
      currentGame.playSuperMaxSceneActive = true;
    });
  }


  function dialogDecryptedMessage4(){
    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "Challenge réussi",
          content: "Quatrième challenge décrypté : " + FOURTH_CHALLENGE_MESSAGE,
                
          controls: [{
            label: "Menu principal",
            class: "button red",
            onClick: menu
          },{
            label: "Challenge suivant", 
            class: "button blue",
            onClick: challenge5
          }]

        });   

      });

    });

  }       





















  function challenge5(){
    $("body").closeAllDialogs(function(){

      // Prepare the second battle message
      currentGame.play_mega_max_scene_msg = createMessageForPlayScene(MEGA_MAX_BOARD_LENGTH, FIFTH_CHALLENGE_MESSAGE);

      // Display the battle scene in background.
      goToBattleScene('play_mega_max_scene', dialogDecryptedMessage5, MEGA_MAX_BOARD_LENGTH, 'playMegaMaxSceneActive', true, false, currentGame.play_mega_max_scene_msg, 'playMegaMaxHelpEvent');

      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "InriOS 3.14",
          content: board_message_to_string(currentGame.play_mega_max_scene_msg.plain_message),
                
          controls: [{
            label: "Décrypter le message", 
            class: "button blue",
            onClick: playLevel5
          }]

        });   

      });

    });

  }

  $(document).on("playMegaMaxHelpEvent", function() {
    activateHelp(currentGame.scenes.play_mega_max_scene, "playMegaMaxSceneActive", helpDialog1);
  });

  function playLevel5(){
    $("body").closeAllDialogs(function(){
      // Active input for play_super_max_scene
      currentGame.iaPlay = true;
      currentGame.scenes.play_mega_max_scene.scene.setPaused(false);
      currentGame.playMegaMaxSceneActive = true;
    });
  }


  function dialogDecryptedMessage5(){
    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "Challenge réussi",
          content: "Cinquième challenge décrypté : " + FIFTH_CHALLENGE_MESSAGE,
                
          controls: [{
            label: "Menu principal", 
            class: "button blue",
            onClick: menu
          }]

        });   

      });

    });

  }       

  menu();

  var firstLaunch = false;
  var haveName = false;
  function firstDialog(challenge) {
    firstLaunch = true;
    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({

          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,
          type: "withAvatar",
          avatar: "<img src='img/avatar-chercheuse.jpg'>",

          title: "Chercheuse",
          content: "Si tu as besoin d'aide, appuie sur le bouton '?' et je te donnerai toutes les informations nécessaires.",
          controls: [{
            label: "Suite", 
            class: "button blue",
            onClick: challenge
          }]
        });   

      });

    });
  }

  function deactivateMenu() {
    var allItems = ['item-public-key', 'item-8-board', 'item-10-board', 'item-12-board', 'item-14-board', 'item-16-board'];
    for (var i = 0; i < allItems.length; ++i) {
      $('#' + allItems[i]).removeClass('active');
    }
  }

  function menu() {
    $("body").closeAllDialogs(function(){
      $.switchWrapper('#menu-view', function() {
        deactivateMenu();
        $('#item-public-key').addClass('active');
      });
    });
  }


  function launchChallenge(challenge) {
    if (haveName === false) {
      haveName = true;
      getName(challenge);
    } else {
      firstLaunch === false ? firstDialog(challenge) : challenge();
    }
  }

  $('#link-public-key').bind('click', function() {
    deactivateMenu();
    if (haveName === false) {
      haveName = true;
      getName(announcePublicKey, true);
    } else {
      announcePublicKey();
    }
  });
  $('#link-8-board').bind('click', function() {
    deactivateMenu();
    launchChallenge(challenge1);
  });
  $('#link-10-board').bind('click', function() {
    deactivateMenu();
    launchChallenge(challenge2);
  });
  $('#link-12-board').bind('click', function() {
    deactivateMenu();
    launchChallenge(challenge3);
  });
  $('#link-14-board').bind('click', function() {
    deactivateMenu();
    launchChallenge(challenge4);
  });
  $('#link-16-board').bind('click', function() {
    deactivateMenu();
    launchChallenge(challenge5);
  });
});
