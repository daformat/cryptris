
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

  function intro() {

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
  }

    function welcome(){
        $("body").closeAllDialogs(function(){
          $(".wrapper.active .vertical-centering").dialog({
            
              animateText: true,
              animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

              type: "withAvatar",
              avatar: "<img src='img/avatar-chercheuse.jpg'>",

              title: "Chercheuse",
              content: "Bonjour"+( game.player.name ? " <em>"+game.player.name+"</em>" : "" ) + ", bienvenue à l'INRIA. Nous allons te proposer une succession de messages cryptés avec une difficulté croissante. ",
              
              controls: [{
                label: "Suite", 
                class: "button blue",
                onClick: dialog5
              }]

            });   

          });

    }

  function dialog5(){
        
    $("body").closeAllDialogs(function(){
      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='img/avatar-chercheuse.jpg'>",

          title: "Chercheuse",
          content: "Tout d'abord tu vas créer ta paire de clé privée / clé publique mais<span>...</span> n’oublie pas, cette clé privée est... privée ! Toi seul dois la connaître ! Ta clé publique sera diffusée sur le réseau à l’ensemble des chercheurs de l’Institut.",
                
          controls: [{
            label: "Suite", 
            class: "button blue",
            onClick: dialog6
          }]

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
                                        transitionTime,
                                        true,
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
          //content: "Voici ta clé privée, tu peux la manipuler à l’aide des touches<br/> <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> de ton clavier pour en décaler les colonnes. Tu peux aussi inverser les colonnes avec <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'>. Quand tu auras fini, appuie sur <img src='img/icn-arrow-down.png' class='keyboard-key'> pour valider ton choix. L’ordinateur va ensuite générer ta clé publique.",

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
    helpFunction();
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

    function dialogContinueManipulatingToGeneratePublicKey(){
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
                      dialog7();
                      currentGame.dontShowKey = false;
                    }, 2000);
                }
            }
        );
    }

    function dialog7(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-circuits', function(){

              $(".wrapper.active .vertical-centering").dialog({
                
                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                title: "Chercheuse",
                content: "Parfait ! Te voilà fin prêt! J’ai bien ta clé publique... Commençons le challenge.",
                
                controls: [{
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
        console.log(currentGame.scenes[sceneName]);
        preparePlayScene(currentGame.director, sizeBoard, sceneName, message, hookName, withIaBoard, helpEvent);
        console.log(currentGame.scenes[sceneName]);
        currentGame.iaPlay = false;
        currentGame[hookName] = false;
        currentGame.gameOver = false;
        currentGame.tooManyBlocksInAColumn = false;

        currentGame.director.currentScene.setPaused(false);
        currentGame.director.easeInOut(currentGame.director.getSceneIndex(currentGame.scenes[sceneName].scene), CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                        currentGame.director.getSceneIndex(currentGame.director.currentScene), CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER, transitionTime, true,
                                        new specialInInterpolator(), new specialOutInterpolator());
        
        console.log(sceneName);

        setTimeout(function() {currentGame.scenes[sceneName].add_key_symbol(currentGame.director, currentGame.scenes[sceneName])}, 500);

        // set the speed of this scene.
        timeInfo && withIaBoard ? currentGame.scenes[sceneName].rival_box.boxOption.timeInfo = timeInfo : null;

        // Create a timer to catch the moment we have to go to the next scene.
        var waitToContinue = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
            function(time, ttime, timerTask) {
                if (currentGame.goToNextDialog === true) {
                    waitToContinue.cancel();
                    currentGame.goToNextDialog = false;

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
            currentGame.play_min_scene_msg = createMessageForPlayScene(MIN_BOARD_LENGTH, FIRST_BATTLE_MESSAGE);
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
                  onClick: dialog9
                }]

              });   

            });

        });

    }

    function dialog9(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-circuits', function(){

            // Display the battle scene in background.
            goToBattleScene('play_min_scene', dialogDecryptedMessage1, MIN_BOARD_LENGTH, 'playMinSceneActive', true, false, currentGame.play_min_scene_msg, 'playMinHelpEvent');

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
                  onClick: dialog10
                }]

              });   

            });

        });

    }

    function dialog10(){
        $("body").closeAllDialogs(function(){

        // Launch the timer and display private key.

        currentGame.scenes.play_min_scene.add_key_symbol(currentGame.director, currentGame.scenes.play_min_scene);
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
            onClick: playLevel1
          }]

        });   

      });

    }

  $(document).on("playMinHelpEvent", function() {
    activateHelp(currentGame.scenes.play_min_scene, "playMinSceneActive", helpPlayMin);
  });

  function helpPlayMin() {

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){
        $(".wrapper.active .vertical-centering").dialog({
          
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='img/avatar-chercheuse.jpg'>",

          title: "Chercheuse",
          content: "Help PLAY_MIN",
          controls: [{
            label: "Suite", 
            class: "button blue",
            onClick: function() {
              deActivateHelp(currentGame.scenes.play_min_scene, "playMinSceneActive");
            }
          }]

        });
  

      });

    });
  }

    function playLevel1(){
        $("body").closeAllDialogs(function(){
            // Active input for play_min_scene
            currentGame.iaPlay = true;
            currentGame.scenes.play_min_scene.scene.setPaused(false);
            currentGame.playMinSceneActive = true;
        });
    }


    function dialogDecryptedMessage1(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-circuits', function(){

              $(".wrapper.active .vertical-centering").dialog({
                
                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

                title: "Message décrypté",
                content: "Premier challenge décrypté : 24",
                
                controls: [{
                  label: "Challenge suivant", 
                  class: "button blue",
                  onClick: dialogCables1
                }]

              });   

            });

        });

    }       



    function dialogCables1(){
        $("body").closeAllDialogs(function(){
            $.switchWrapper('#bg-institut', function(){

              // Disable the action on the key and switch to the waiting scene.
              currentGame.playMinSceneActive = false;
        currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['waiting_scene']), transitionTime, true, false);
              $(".wrapper.active .vertical-centering").dialog({
                

                type: "cables",
                title: "Séléctionner le cable à débrancher",

              });

          $('.cables').prepareCables(24, dialogSuccessCables1);

            });

        });
    }   



    function dialogSuccessCables1(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){

              $(".wrapper.active .vertical-centering").dialog({
                
                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                title: "Chercheuse",
                content: "Bravo, tu as débranché le bon câble ! Plus que deux panneaux électriques et ça devrait être bon !",
                
                controls: [{
                  label: "Suite", 
                  class: "button blue",
                  onClick: dialogServerIsFaster
                }]

              });   

            });

        });

    }


    function dialogServerIsFaster(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){

              $(".wrapper.active .vertical-centering").dialog({
                
                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                title: "Chercheuse",
                content: "Malheureusement, le serveur a accès à notre base de données, <span>et a appris</span> comment décrypter plus vite. Je fais ce que je peux pour le ralentir, mais sa capacité de calcul et son adresse ne font qu'augmenter !",
                
                controls: [{
                  label: "Suite", 
                  class: "button blue",
                  onClick: dialogSendingSecondCable
                }]

              });   

            });

        });

    }   


    function dialogSendingSecondCable(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){

              $(".wrapper.active .vertical-centering").dialog({
                
                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                title: "Chercheuse",
                content: "Je t'envoie le deuxième câble, crypté avec deux blocs de plus. Avec la cryptographie asymétrique, lorsqu’on augmente le  nombre de bits, la difficulté du calcul augmente de manière exponentielle pour un attaquant. Cela devrait donc faire l’affaire.",
                
                controls: [{
                  label: "Suite", 
                  class: "button blue",
                  onClick: dialogEcnryptedSecondCable
                }]

              });   

            });

        });

    }



    function dialogEcnryptedSecondCable(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){
        // Prepare the second battle message
        currentGame.play_medium_scene_msg = createMessageForPlayScene(MEDIUM_BOARD_LENGTH, SECOND_BATTLE_MESSAGE);

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
    activateHelp(currentGame.scenes.play_medium_scene, "playMediumSceneActive", helpPlayMedium);
  });

  function helpPlayMedium() {

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){
        $(".wrapper.active .vertical-centering").dialog({
          
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='img/avatar-chercheuse.jpg'>",

          title: "Chercheuse",
          content: "Help PLAY_MEDIUM",
          controls: [{
            label: "Suite", 
            class: "button blue",
            onClick: function() {
              deActivateHelp(currentGame.scenes.play_medium_scene, "playMediumSceneActive");
            }
          }]

        });
  

      });

    });
  }

    function playLevel2() {
        $("body").closeAllDialogs(function() {          
            $.switchWrapper('#bg-circuits', function(){
        // Display the battle scene in background.
        goToBattleScene('play_medium_scene', dialogDecryptedMessage2, MEDIUM_BOARD_LENGTH, 'playMediumSceneActive', true, false, currentGame.play_medium_scene_msg, 'playMediumHelpEvent');
                // Active input for play_medium_scene
            currentGame.iaPlay = true;
        currentGame.scenes.play_medium_scene.scene.setPaused(false);
        currentGame.playMediumSceneActive = true;
        currentGame.scenes.play_medium_scene.add_key_symbol(currentGame.director, currentGame.scenes.play_medium_scene);
            });
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

                title: "Message décrypté",
                content: "Débranche le câble 78 du panneau électrique M",
                
                controls: [{
                  label: "Débrancher le câble", 
                  class: "button blue",
                  onClick: dialogCables2
                }]

              });   

            });

        });

    }           
    

    function dialogCables2(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){
              // Disable the action on the key and switch to the waiting scene.
              currentGame.playMinSceneActive = false;
        currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['waiting_scene']), transitionTime, true, false);

              $(".wrapper.active .vertical-centering").dialog({
                

                type: "cables",
                title: "Sélectionner le câble à débrancher",

              });

          $('.cables').prepareCables(78, dialogSuccessCables2);

            });

        });
    }   



    function dialogSuccessCables2(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){

              $(".wrapper.active .vertical-centering").dialog({
                
                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                title: "Chercheuse",
                content: "Très bien, tu as débranché le bon câble ! Plus qu'un panneau électrique et je pourrai enfin sortir !",
                
                controls: [{
                  label: "Suite", 
                  class: "button blue",
                  onClick: dialogServerIsInfectingOtherMachines
                }]

              });   

            });

        });
    }


    function dialogServerIsInfectingOtherMachines(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){

              $(".wrapper.active .vertical-centering").dialog({
                
                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                title: "Chercheuse",
                content: "Ce serveur ne devrait pas être en mesure de décrypter aussi rapidement ces messages... J’ai compris ! Il contamine d’autres ordinateurs et augmente ainsi sa puissance !",
                
                controls: [{
                  label: "Suite", 
                  class: "button blue",
                  onClick: dialogSendingThirdCable
                }]

              });   

            });

        });

    }



    function dialogSendingThirdCable(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){

              $(".wrapper.active .vertical-centering").dialog({
                
                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                title: "Chercheuse",
                content: "Je t'envoie le dernier câble, en augmentant encore la difficulté du cryptage. Il lui faudra quelques centaines de jours pour <span>décrypter ce dernier message</span>, et d'ici là nous l'aurons débranché et analysé !",
                
                controls: [{
                  label: "Suite", 
                  class: "button blue",
                  onClick: dialogEcnryptedThirdCable
                }]

              });   

            });

        });             

    }


    function dialogEcnryptedThirdCable(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){
        // Prepare the third battle message
        currentGame.play_max_scene_msg = createMessageForPlayScene(MAX_BOARD_LENGTH, THIRD_BATTLE_MESSAGE);

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
    activateHelp(currentGame.scenes.play_max_scene, "playMaxSceneActive", helpPlayMax);
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
          content: "Help PLAY_MAX",
          controls: [{
            label: "Suite", 
            class: "button blue",
            onClick: function() {
              deActivateHelp(currentGame.scenes.play_max_scene, "playMaxSceneActive");
            }
          }]

        });
  

      });

    });
  }

    function playLevel3() {
        $("body").closeAllDialogs(function() {          
            $.switchWrapper('#bg-circuits', function(){
        // Display the battle scene in background.
        goToBattleScene('play_max_scene', dialogDecryptedMessage3, MAX_BOARD_LENGTH, 'playMaxSceneActive', true, false, currentGame.play_max_scene_msg, 'playMaxHelpEvent');
        // Active input for play_max_scene
            currentGame.iaPlay = true;
        currentGame.scenes.play_max_scene.scene.setPaused(false);
        currentGame.playMaxSceneActive = true;
        currentGame.scenes.play_max_scene.add_key_symbol(currentGame.director, currentGame.scenes.play_max_scene);
            });
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

                title: "Message décrypté",
                content: "Débranche le câble 31 du panneau électrique N",
                
                controls: [{
                  label: "Débrancher le câble", 
                  class: "button blue",
                  onClick: dialogCables3
                }]

              });   

            });

        });

    }           
    

    function dialogCables3(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){
              // Disable the action on the key and switch to the waiting scene.
              currentGame.playMinSceneActive = false;
              currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['waiting_scene']), transitionTime, true, false);

              $(".wrapper.active .vertical-centering").dialog({
                
                type: "cables",
                title: "Sélectionner le cable à débrancher",

              });

          $('.cables').prepareCables(31, dialogSuccessCables3);

            });

        });
    }       



    function dialogSuccessCables3(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){

              $(".wrapper.active .vertical-centering").dialog({
                
                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                title: "Chercheuse",
                content: "Mes félicitations ! Nous avons réussi à contenir la machine. Sa capacité de calcul augmentait de manière phénoménale, mais pas aussi rapidement que la difficulté du décryptage…",
                
                controls: [{
                  label: "Suite", 
                  class: "button blue",
                  onClick: dialogIWasTrapped
                }]

              });   

            });

        });             

    }


    function dialogIWasTrapped(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){

              $(".wrapper.active .vertical-centering").dialog({
                
                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                title: "Chercheuse",
                content: "J’ai bien failli rester enfermée pour de bon et le serveur aurait pu contaminer tout internet, absorbant les données personnelles de la planète entière !",
                
                controls: [{
                  label: "Suite", 
                  class: "button blue",
                  onClick: dialogThanksToCrypto
                }]

              });   

            });

        });             

    }   


    function dialogThanksToCrypto(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){

              $(".wrapper.active .vertical-centering").dialog({
                
                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                title: "Chercheuse",
                content: "Heureusement, grâce à la cryptographie asymétrique, aucune machine ne peut décrypter assez vite nos messages. Les différents niveaux d’encryption ne t’ont pas vraiment compliqué <span>la tâche,</span> car tu disposes de la clé privée.",
                
                controls: [{
                  label: "Suite", 
                  class: "button blue",
                  onClick: dialogThanksToCrypto2
                }]

              });   

            });

        });             

    }       


    function dialogThanksToCrypto2(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){

              $(".wrapper.active .vertical-centering").dialog({
                
                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                title: "Chercheuse",
                content: "En revanche la difficulté pour l’ordinateur a augmenté bien plus vite que sa capacité de calcul. CQFD !",
                
                controls: [{
                  label: "Suite", 
                  class: "button blue",
                  onClick: dialogComparePlayTimeChart
                }]
              });   
            });
        });             
    }       

    intro();

});
