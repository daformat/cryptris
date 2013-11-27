
var cryptrisSettings = {
    readingDelay: 4000,
    animateTextDelayBetweenLetters: 20,
    player: {},
    cryptoExplanations: [false, false, false],
    dialogWhatArePrivatePublicKey: [false, false, false]
}

$(function() {

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

  $(document).on("playSoloHelpEvent", function() {
    activateHelp(currentGame.scenes.play_solo_scene, "playSoloSceneActive", helpPlaySolo);
  });


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
          nowTryToCancelLastMove();
        }
      }
    );

    var waitToContinue = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
      function(time, ttime, timerTask) {
        if (currentGame.scenes.create_key_scene.game_box.crypt_key.numberApplied === currentGame.maxNewKeyMove) {
          waitToContinue.cancel();
          currentGame.createKeySceneActive = false;
          keyPreGenerated();
        }
      }
    );
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
          //currentGame.scenes.create_key_scene.scene.setPaused(true);

          // Disable the action on the key.
          setTimeout(function() {
            currentGame.director.easeInOut(currentGame.director.getSceneIndex(currentGame.scenes.waiting_scene), CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                           currentGame.director.getSceneIndex(currentGame.scenes.create_key_scene.scene), CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER, transitionTime, true,
                                           new specialInInterpolator(), new specialOutInterpolator());
            //currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['waiting_scene']), transitionTime, true, false);
            wellDone();
            currentGame.dontShowKey = false;
          }, 2000);
        }
      }
    );
  }

  $.goToBattleScene = goToBattleScene;
  var currentGameOverData = null;

  function stopGameOver() {
    var saveScene = currentGame.scenes[currentGameOverData.sceneName].scene;
    goToBattleScene(currentGameOverData.sceneName, currentGameOverData.onDecrypt, currentGameOverData.sizeBoard, currentGameOverData.hookName, currentGameOverData.withIaBoard, currentGameOverData.timeInfo, currentGameOverData.message, currentGameOverData.helpEvent, currentGameOverData.timeout);
    saveScene.setExpired(true);
    $("body").closeAllDialogs(function() {});
    currentGame.scenes[currentGameOverData.sceneName].scene.setPaused(false);
    currentGame.scenes[currentGameOverData.sceneName].add_key_symbol(currentGame.director, currentGame.scenes[currentGameOverData.sceneName]);
    currentGame[currentGameOverData.hookName] = true;
    currentGame.iaPlay = true;
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
            gameOver();
          } else if (currentGame.tooManyBlocksInAColumn === true) {
            tooManyBlocks();
          }
          currentGame.gameOver = false;
          currentGame.tooManyBlocksInAColumn = false;
        }
      }
    );
  }

  function activatePlaySolo() {
    $("body").closeAllDialogs(function() {});
    currentGame.scenes.play_solo_scene.scene.setPaused(false);
    currentGame.playSoloSceneActive = true;
  }

  var game = cryptrisSettings;
  var transitionTime = 1000;

  // -- Hide .hidden elements and remove class.
  $('.hidden').hide().removeClass('hidden');

  function intro() {
    // -- Make sure prompt is empty.
    $('.prompt .content').text('');

    // -- Launch the welcome dialog.
    $("body").closeAllDialogs(function() { 
      firstPrompt(welcome);
    });
  }

  function welcome() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-institut', function() {
        $(".wrapper.active .vertical-centering").dialog(welcomeInstituteDialog);   
      });
    });
  }

  function switchToNewLogin() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#new-login', function() {
        $('#login-name').focus();

        $('.new-login').submit(function(e) {
          currentGame.litteralName = $('#login-name').val();
          currentGame.username = currentGame.litteralName !== "" ? currentGame.litteralName : 'Joueur';
          updateAccountCreatedDialog();
          updateCryptoExplanations();
          updateKeysExplanations();
          $.switchWrapper('#bg-institut', accountCreated);
          $('#login-name').blur();
          $('.new-login').unbind('submit').submit(function(e) {
            return false;
          });
          return false;
        });
      });
    });
  }

  function accountCreated() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-institut', function() {
        $(".wrapper.active .vertical-centering").dialog(accountCreatedDialog);   
      });
    });
  }

  function cryptoExplanations() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-institut', function() {
        addCryptoExplanationsContent();
        $(".wrapper.active .vertical-centering").dialog(cryptoExplanationsDialog);   
      });
    });
  }

  function cryptoExplanationsOpt1() {
    game.cryptoExplanations[0] = true;
    $("body").closeAllDialogs(function() {   
      $.switchWrapper('#bg-institut', function() {
        $(".wrapper.active .vertical-centering").dialog(cryptoExplanationsOpt1Dialog);   
      });
    });
  }

  function cryptoExplanationsOpt2() {
    game.cryptoExplanations[1] = true;
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-institut', function() {
        $(".wrapper.active .vertical-centering").dialog(cryptoExplanationsOpt2Dialog);
      });
    });
  }

  function goingToCreakeKeys() {
    game.cryptoExplanations[2] = true;
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-institut', function() {
        $(".wrapper.active .vertical-centering").dialog(goingToCreateKeysDialog);      
      });
    });
  }

  function dialogWhatArePrivatePublicKey() {
    addKeysExplanationsContent();
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-institut', function() {
        $(".wrapper.active .vertical-centering").dialog(keysExplanationsDialog);   
      });
    });
  }

  function dialogWhatArePrivatePublicKeyOpt1() {
    game.dialogWhatArePrivatePublicKey[0] = true;
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-institut', function() {
        $(".wrapper.active .vertical-centering").dialog(keysExplanationsOpt1Dialog);   
      });
    });
  }   


  function dialogWhatArePrivatePublicKeyOpt2() {
    game.dialogWhatArePrivatePublicKey[1] = true;
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-institut', function() {
        $(".wrapper.active .vertical-centering").dialog(keysExplanationsOpt2Dialog);   
      });
    });
  }       


  function hereYourPrivateKey() {
    game.dialogWhatArePrivatePublicKey[2] = true;

    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
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
        $(".wrapper.active .vertical-centering").dialog(hereYourPrivateKeyDialog);
      });
    });
  }


  function helpCreateKey() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(helpCreateKeyDialog);
      });
    });
  }


  function pleaseInvertYourPrivateKey() {

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
            continueManipulatingToGeneratePublicKey();
          } else {
            okDontInvertYourPrivateKey();
          }
        }
      }
    );

    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(pleaseInvertYourPrivateKeyDialog);
      });
    });
  }

  function okDontInvertYourPrivateKey() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(okDontInvertYourPrivateKeyDialog);
      });
    });
  }
  
  function nowTryToCancelLastMove(){
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
            continueManipulatingToGeneratePublicKey();
          } else {
            pleaseInvertYourPrivateKey();
          }
        }
      }
    );

    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(nowTryToCancelLastMoveDialog);
      });
    });
  }

  function continueManipulatingToGeneratePublicKey() {
    currentGame.createKeySceneActive = false;
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(continueManipulatingToGeneratePublicKeyDialog);
      });
    });
  }       

  function keyPreGenerated() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(keyPreGeneratedDialog);
      });
    });
  }

  function wellDone() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-institut', function() {
        $(".wrapper.active .vertical-centering").dialog(wellDoneDialog);   
      });
    });
  }

  function gameOver() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(gameOverDialog);
      });
    });
  }

  function tooManyBlocks() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(tooManyBlocksDialog);
      });
    });
  }

  function firstMessage() {
    // Prepare the tutorial message
    currentGame.play_solo_scene_msg = createMessageForPlayScene(MIN_BOARD_LENGTH, FIRST_MESSAGE);
        
    // Set the tutorial message to the dialog box.
    addInteractiveContentToDialog(firstMessageDialog, board_message_to_string(currentGame.play_solo_scene_msg.plain_message));

    $("body").closeAllDialogs(function() {
      $(".wrapper.active .vertical-centering").dialog(firstMessageDialog);   
    });
  }   

  function helpPlaySolo() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(helpPlaySoloDialog);
      });
    });
  }

  function messageTest() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        // Display the battle scene in background.
        goToBattleScene('play_solo_scene', dialogDecryptedMessage0, MIN_BOARD_LENGTH, 'playSoloSceneActive', false, false, currentGame.play_solo_scene_msg, 'playSoloHelpEvent', 4000);
        $(".wrapper.active .vertical-centering").dialog(messageTestDialog);
      });
    });
  }

  function tutorial() {
    $("body").closeAllDialogs(function() {
      // Launch the timer and display private key.
      currentGame.scenes.play_solo_scene.add_key_symbol(currentGame.director, currentGame.scenes.play_solo_scene);
      $(".wrapper.active .vertical-centering").dialog(tutorialDialog);   
    });
  }



    function dialogDecryptedMessage0(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-circuits', function(){

              $(".wrapper.active .vertical-centering").dialog({
                
                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

                title: "Message décrypté",
                content: "Ok, tu as réussi à lire ce message :)",
                
                controls: [{
                  label: "Suite", 
                  class: "button blue",
                  onClick: dialogCongratulationsOnCompletingTutorial
                }]

              });   

            });

        });

    }       


    function dialogCongratulationsOnCompletingTutorial(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){
              // Disable the action on the key and switch to the waiting scene.
              currentGame.playSoloSceneActive = false;
              currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['waiting_scene']), transitionTime, true, false);

              $(".wrapper.active .vertical-centering").dialog({
                
                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                title: "Chercheuse",
                content: "Parfait ! Tu as compris <em>comment décrypter un message à l'aide de ta clé privée,</em> je n’en attendais pas <span>moins de toi !</span> Te voilà fin prêt et tu es maintenant un membre à part entière de l’Institut.",
                
                controls: [{
                  label: "Suite", 
                  class: "button blue",
                  onClick: dialog12
                }]

              });   

            });

        });

    }   



    function dialog12(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){

              $(".wrapper.active .vertical-centering").dialog({
                
                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                title: "Chercheuse",
                content: "C'est bizarre, le serveur a signalé une panne, je dois aller en salle des machines pour vérifier que tout est en ordre. Il faudra que tu branches ou débranches certains câbles.",
                
                controls: [{
                  label: "Suite", 
                  class: "button blue",
                  onClick: dialog13
                }]

              });   

            });

        });

    }

    function dialog13(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){

              $(".wrapper.active .vertical-centering").dialog({
                
                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                title: "Chercheuse",
                content: ( game.player.name ? " <em>"+game.player.name+",</em> e" : "E" ) + "st-ce que tu me reçois ? C’est vraiment bizarre, notre serveur refuse obstinément de se re-configurer et m'empêche de sortir <sspan>de la salle </sspan>des machines, essaie de débrancher le câble n° 42 du tableau électrique principal.",
                
                controls: [{
                  label: "Suite", 
                  class: "button blue",
                  onClick: dialogCables0
                }]


              });   

            });

        });

    }   


    function dialogCables0(){
        $("body").closeAllDialogs(function(){
            $.switchWrapper('#bg-institut', function(){

              $(".wrapper.active .vertical-centering").dialog({
                

                type: "cables",
                title: "Séléctionner le cable à débrancher",

              });

          $('.cables').prepareCables(null, dialogElectricShock);

            });

        });
    }


    function dialogElectricShock(){
        $("body").closeAllDialogs(function(){

          $(".wrapper.active .vertical-centering").dialog({
            
            type: "player",
            title: game.player.name||"Joueur",

            content: [{
                label: "Aie ! Je viens de me prendre une décharge électrique !",
                onClick: dialogThisAintNormal,
            }]

          });   

        });

    }

    function dialogThisAintNormal(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){

              $(".wrapper.active .vertical-centering").dialog({
                
                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                title: "Chercheuse",
                content: "Attends, ce n’est pas normal... Laisse-moi vérifier... Ça alors ! Le serveur s’est reprogrammé de lui-même et c’est lui qui contrôle le système. Manifestement, il nous écoute et t’a empêché de débrancher le câble, tout comme il a verrouillé les portes de la salle. Je suis enfermée ici !",
                
                controls: [{
                  label: "Suite", 
                  class: "button blue",
                  onClick: dialogUseCryptoProtocol
                }]

              });   

            });

        });

    }

    function dialogUseCryptoProtocol(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){

              $(".wrapper.active .vertical-centering").dialog({
                
                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                title: "Chercheuse",
                content: "C’est le bon moment pour utiliser le protocole de cryptage afin de l’empêcher de nous écouter ! Je vais t'envoyer la liste des câbles à débrancher, mais un par un, et de manière cryptée.",
                
                controls: [{
                  label: "Suite", 
                  class: "button blue",
                  onClick: dialogSendingFirstCable
                }]

              });   

            });

        });

    }


    function dialogSendingFirstCable(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){

              $(".wrapper.active .vertical-centering").dialog({
                
                animateText: true,
                animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

                type: "withAvatar",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                title: "Chercheuse",
                content: "Je t'envoie un message crypté contenant le premier numéro de câble à débrancher et le tableau électrique correspondant.",
                
                controls: [{
                  label: "Suite", 
                  class: "button blue",
                  onClick: dialogEcnryptedFirstCable
                }]

              });   

            });

        });

    }   


    function dialogEcnryptedFirstCable(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){
              // Prepare the first battle message
              currentGame.play_min_scene_msg = createMessageForPlayScene(MIN_BOARD_LENGTH, FIRST_BATTLE_MESSAGE);

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
                  onClick: dialogServerAlsoTryingToBreakEncryption
                }]

              });   

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

    function dialogServerAlsoTryingToBreakEncryption(){
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
                content: "Zut, le serveur essaie lui aussi de décrypter le message, <em>heureusement il ne dispose que de ta clé publique !</em> Je t’envoie en temps réel les informations correspondant à son avancé, dépêche toi de décrypter le message avant qu’il n’arrive à casser le code.",
                
                controls: [{
                  label: "Décrypter le message", 
                  class: "button blue",
                  onClick: playLevel1
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
                content: "Débranche le câble 24 du panneau électrique V",
                
                controls: [{
                  label: "Débrancher le câble", 
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

    function dialogComparePlayTimeChart() {
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#bg-institut', function(){

              $(".wrapper.active .vertical-centering").dialog({
                
                type: "graph",
                avatar: "<img src='img/avatar-chercheuse.jpg'>",

                title: "Comparaison du temps de décryptage",
                content: "Blah blah",
                
                controls: [{
                  label: "Suite", 
                  class: "button blue",
                  onClick: theEnd
                }]

              });   

        
              setTimeout(function(){



                    // define dimensions of graph
                    var m = [20, 25, 45, 130]; // margins
                    var w = 355 - m[1] - m[3]; // width
                    var h = 350 - m[0] - m[2]; // height
                    
                    var dataIAInitial = [{x: 8, y: 0}, {x: 9, y: 0}, {x: 10, y: 0}, {x: 11, y: 0}, {x: 12, y: 0}];
                    var dataIA = [{x: 8, y: 131072 * 3.75}, {x: 9, y: 524288 * 3.2}, {x: 10, y: 2097152 * 1.7}, {x: 11, y: 8388608 * 1.2}, {x: 12, y: 33554432}];
                    var dataPlayerInitial = [{x: 8, y: 0}, {x: 10, y: 0}, {x: 12, y: 0}];
                    var dataPlayer = [{x: 8, y: 120/2}, {x: 10, y: 240/2}, {x: 12, y: 360/2}];      

                    // X scale will fit all values from data[] within pixels 0-w
                    var x = d3.scale.linear().domain([8, 12]).range([0, w]);

                    // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
                    var y = d3.scale.linear().range([h, 0]).domain([60, dataPlayer[2].y*1.3]);

                    var div = d3.select("body").append("div")   
                        .attr("class", "tooltip")               
                        .style("opacity", 0);

                    var options = {m: m, w: w, h: h, x: x, y: y, div: div };


                        // Add an SVG element with the desired dimensions and margin.
                        var graph = d3.select("#graph").append("svg:svg")
                              .attr("width", w + m[1] + m[3])
                              .attr("height", h + m[0] + m[2])
                            .append("svg:g")
                              .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

                        options.name = (game.player.name || "Joueur");

                        populateChart(graph, dataPlayer, dataPlayerInitial, 'player', options);

                        var graph2 = d3.select("#graph").append("svg:svg")
                              .attr("width", w + m[1] + m[3])
                              .attr("height", h + m[0] + m[2])
                            .append("svg:g")
                              .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

                    y = d3.scale.linear().range([h, 0]).domain([0, dataIA[4].y]);

                    options.y = y;
                    options.name = 'Serveur';


                        populateChart(graph2, dataIA, dataIAInitial, 'ia', options);
                        



                        }, 100);

            });

        });     
    }

    function populateChart(graph, dataSet, dataInitial, appendClass, options)
    {
            var m = options.m;
            var w = options.w;
            var h = options.h;
            var x = options.x;
            var y = options.y;
            var div = options.div;
            var name = options.name;

                    var zoom = d3.behavior.zoom()
                        .x(y)
                        .y(y)
                        .scaleExtent([0.001, 200])
                        .on("zoom", zoomed);


                    
                    function zoomed() {

                     var trans = zoom.translate(),
                         scale = zoom.scale();

                     tx = Math.min(0, Math.max(w * (1 - scale), trans[0]));
                     ty = Math.min(0, Math.max(h * (1 - scale), trans[1]));

                     zoom.translate([tx, ty]);


                      graph.select(".x.axis").call(xAxis);
                      graph.select(".y.axis").call(yAxis);
                    graph.select("path.line."+appendClass).attr("d", line(dataSet));
                    graph.selectAll("circle."+appendClass).attr("cy",  function(d, i) { return y(dataSet[i].y); });

                    }

                    graph.call(zoom);

                    // create a line function that can convert data[] into x and y points
                    var line = d3.svg.line()
                        // assign the X function to plot our line as we wish
                        .x(function(d,i) { 
                            // return the X coordinate where we want to plot this datapoint
                            return x(d.x); 
                        })

                        .y(function(d, i) { 
                            // return the Y coordinate where we want to plot this datapoint
                            return y(d.y); 
                        }).interpolate("cardinal") ;

                    var formatTime = d3.time.format("%Hh %Mm %Ss"),
                            formatSeconds = function(d) {
                                var sign = (d<0 ? "-" : "");
                                d = Math.abs(d);
                                var sec_num = parseInt(d, 10); // don't forget the second parm
                              var days   =  Math.floor(sec_num / 86400);
                              var hours   = Math.floor((sec_num - (days * 86400)) / 3600);
                              var minutes = Math.floor((sec_num - (days * 86400 + hours * 3600)) / 60);
                              var seconds = sec_num - (days * 86400 + hours * 3600) - (minutes * 60);

                              if (hours   < 10) {hours   = "0"+hours;}
                              if (minutes < 10) {minutes = "0"+minutes;}
                              if (seconds < 10) {seconds = "0"+seconds;}


                              var time    = sign + (days>0 ? days+'j ' : '' ) + (days>10 ? '' : (hours == "00" ? "": hours)+(days>0 ? (hours == "00" ? "": "h ") : (hours == "00" ? "": "h ")+minutes+'m '+seconds+ 's'));
                              return ( d == 0 ? '0' : time);
                            };

                        graph.append("rect")
                                .attr("x", 0-20)
                                .attr("y", 0-20)
                                .attr("width", w+20)
                                .attr("height", h+40)
                                .attr("fill", "#93bcd7")
                                //.attr("stroke", "#abcdef");

                        graph.append("clipPath")
                            .attr("id", "clip")
                          .append("rect")
                            .attr("x", -15)
                            .attr("y", -15)
                            .attr("width", w+35)
                            .attr("height", h+25);

                        var clip = d3.select("clip");

                        // create xAxis
                        var xAxis = d3.svg.axis().scale(x).ticks(3).tickSize(10).tickSubdivide(false);
                        // Add the x-axis.
                        graph.append("svg:g")
                              .attr("class", "x axis")
                              .attr("transform", "translate(0," + h + ")")
                              .call(xAxis);


                        // create left yAxis
                        var yAxis = d3.svg.axis().scale(y).ticks(4).tickSize(-w - m[1]).tickFormat(formatSeconds).orient("left");
                        // Add the y-axis to the left
                        graph.append("svg:g")
                              .attr("class", "y axis")
                              .attr("transform", "translate(-25,0)")
                              .call(yAxis);
                        
                    graph.append("text")
                        .attr("class", "x label")
                        .attr("text-anchor", "end")
                        .attr("x", w+10)
                        .attr("y", h + m[2]-6)
                        .text("Taille de la clé (blocs)");

                    graph.append("text")
                        .attr("class", "y label")
                        .attr("text-anchor", "end")
                        .attr("y", 6)
                        .attr("dy", ".75em")
                        .attr("transform", "rotate(-90) translate(0, -100)")
//                      .attr("transform", "rotate(-90) translate(0, "+ (w+10) +")")
                        .text("Durée du décryptage ("+name+")");                        

                        // Add the line by appending an svg:path element with the data line we created above
                        // do this AFTER the axes above so that the line is above the tick-lines
                        graph.append("svg:path").attr('class', 'line '+appendClass).attr("d", line(dataInitial)).transition().duration(500).attr("d", line(dataSet)).attr("clip-path", "url(#clip)");



                            // draw dots
                            var circles = graph.selectAll("dot")    
                                    .data(dataInitial)         
                                .enter().append("circle")
                                    .attr("class", appendClass)
                                    .attr("r", 5)       
                                    .attr("cx", function(d) { return x(d.x); })       
                                    .attr("cy", function(d) { return y(d.y); }) 
                                    .attr("clip-path", "url(#clip)")    
                                    .on("mouseover", function(d, i) {
                                            d3.select(this).transition().duration(100).ease("quad-in-out").attr("r", 10);
                                        div.transition()        
                                            .duration(200)      
                                            .style("opacity", .9)
                                        div .html("<strong>"+name+"</strong><br/>Taille de la clé : "+d.x+" blocs" + "<br/>Durée (maximale) de décryptage : "  + formatSeconds(parseInt(dataSet[i].y) ) )  
                                            .style("left", (d3.event.pageX+15) + "px")     
                                            .style("top", (d3.event.pageY - 28) + "px");    
                                        })                  
                                    .on("mouseout", function(d) {       
                                            d3.select(this).transition().duration(100).ease("quad-in-out").attr("r", 5);
                                        div.transition()        
                                            .duration(500)      
                                            .style("opacity", 0);   
                                    });         
                            circles.transition().duration(500).attr("cy",  function(d, i) { return y(dataSet[i].y); });


    }


    $.dialogComparePlayTimeChart = dialogComparePlayTimeChart;

    function theEnd(){
        $("body").closeAllDialogs(function(){

            $.switchWrapper('#end-game', function(){
            });
        });
    }

    function addControlToDialogs() {
      addControlToDialog(welcomeInstituteDialog, [{label: "Suite", class: "button blue", onClick: switchToNewLogin}]);
      addControlToDialog(accountCreatedDialog, [{label: "Suite", class: "button blue", onClick: cryptoExplanations}]);
      addControlToDialog(cryptoExplanationsDialog, [{label: "Suite", class: "button blut", onClick: switchToNewLogin}]);
      addControlToDialog(cryptoExplanationsOpt1Dialog, [{label: "Suite", class: "button blue", onClick: cryptoExplanations}]);
      addControlToDialog(cryptoExplanationsOpt2Dialog, [{label: "Suite", class: "button blue", onClick: cryptoExplanations}]);
      addControlToDialog(goingToCreateKeysDialog, [{label: "Suite", class: "button blue", onClick: dialogWhatArePrivatePublicKey}]);
      addControlToDialog(keysExplanationsOpt1Dialog, [{label: "Suite", class: "button blue", onClick: dialogWhatArePrivatePublicKey}]);
      addControlToDialog(keysExplanationsOpt2Dialog, [{label: "Suite", class: "button blue", onClick: dialogWhatArePrivatePublicKey}]);
      addControlToDialog(hereYourPrivateKeyDialog, [{label: "Suite", class: "button blue", onClick: switchToCreateKey}]);
      addControlToDialog(helpCreateKeyDialog, [{label: "Suite", class: "button blue",
        onClick: function() {
          deActivateHelp(currentGame.scenes.create_key_scene, "createKeySceneActive");
        }
      }]);
      addControlToDialog(pleaseInvertYourPrivateKeyDialog, [{label: "Suite", class: "button blue",
        onClick: function() {
          $('body').closeAllDialogs(function() {
            currentGame.createKeySceneActive = true;
          });
        }
      }]);
      addControlToDialog(okDontInvertYourPrivateKeyDialog, [{label: "Suite", class: "button blue",
        onClick: function() {
          $('body').closeAllDialogs(function() {
            currentGame.createKeySceneActive = true;
          });
        }
      }]);
      addControlToDialog(nowTryToCancelLastMoveDialog, [{label: "Suite", class: "button blue",
        onClick: function() {
          $('body').closeAllDialogs(function() {
            currentGame.createKeySceneActive = true;
          });
        }
      }]);
      addControlToDialog(continueManipulatingToGeneratePublicKeyDialog, [{label: "Suite", class: "button blue",
        onClick: function() {
          $('body').closeAllDialogs(function() {
            currentGame.createKeySceneActive = true;
          });
        }
      }]);
      addControlToDialog(keyPreGeneratedDialog, [{label: "Suite", class: "button blue", onClick: switchToFinishCreateKey}]);
      addControlToDialog(wellDoneDialog, [{label: "Suite", class: "button blue", onClick: firstMessage}]);
      addControlToDialog(gameOverDialog, [{label: "Suite", class: "button blue", onClick: stopGameOver}, {label: "Abandonner", class: "button red", onClick: ''}]);
      addControlToDialog(tooManyBlocksDialog, [{label: "Suite", class: "button blue", onClick: stopGameOver}, {label: "Abandonner", class: "button red", onClick: ''}]);
      addControlToDialog(firstMessageDialog, [{label: "Ouvrir le message", class: "button blue", onClick: messageTest}]);
      addControlToDialog(helpPlaySoloDialog, [{label: "Suite", class: "button blue",
        onClick: function() {
          deActivateHelp(currentGame.scenes.play_solo_scene, "playSoloSceneActive");
        }
      }]);
      addControlToDialog(messageTestDialog, [{label: "Suite", class: "button blue", onClick: tutorial}]);
      addControlToDialog(tutorialDialog, [{label: "Suite", class: "button blue", onClick: activatePlaySolo}]);
    }
    addControlToDialogs();

    function addCryptoExplanationsContent() {
      var cryptoExplanationsContent = [{
        label: cryptoExplanationsLabel0, 
        onClick: cryptoExplanationsOpt1,
        class: game.cryptoExplanations[0] ? 'asked': 'not-asked'
      }, {
        label: cryptoExplanationsLabel1,
        onClick: cryptoExplanationsOpt2,
        class: game.cryptoExplanations[1] ? 'asked': 'not-asked'
      }, {
        label: cryptoExplanationsLabel2,
        onClick: goingToCreakeKeys,
        class: game.cryptoExplanations[2] ? 'asked' : 'not-asked'
      }];
      addInteractiveContentToDialog(cryptoExplanationsDialog, cryptoExplanationsContent);
    }

    function addKeysExplanationsContent() {
      var keysExplanationsContent = [{
        label: keysExplanationsLabel0,
        onClick: dialogWhatArePrivatePublicKeyOpt1,
        class: game.dialogWhatArePrivatePublicKey[0] ? 'asked': 'not-asked'
      }, {
        label: keysExplanationsLabel1,
        onClick: dialogWhatArePrivatePublicKeyOpt2,
        class: game.dialogWhatArePrivatePublicKey[1] ? 'asked': 'not-asked'
      }, {
        label: keysExplanationsLabel2,
        onClick: hereYourPrivateKey,
        class: game.dialogWhatArePrivatePublicKey[2] ? 'asked': 'not-asked'
      }];
      addInteractiveContentToDialog(keysExplanationsDialog, keysExplanationsContent);         
    }

    intro();

});



