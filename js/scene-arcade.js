
$(function(){

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

  var game = cryptrisSettings;
  var transitionTime = 1000;

  // hide .hidden elements and remove class
  $('.hidden').hide().removeClass('hidden');

  function getName(level, isCK) {

    // Log event to google analytics
    ga('send', 'event', 'Arcade', 'Renseignement du nom', 'Invite de commande');
    console.log('Arcade - Renseignement du nom - Invite de commande');

    $("body").closeAllDialogs( function(){
      $.switchWrapper('#new-login', function(){
        $('#login-name').focus();
        $('.new-login').submit(function(e){
          
          currentGame.litteralName = $('#login-name').val();
          currentGame.username = currentGame.litteralName !== "" ? currentGame.litteralName : 'Joueur';
          updateNameFunction();

          // Log event to google analytics
          ga('send', 'event', 'Arcade', 'Renseignement du nom', 'Nom choisi : ' + currentGame.username);
          console.log('Arcade - Renseignement du nom - Nom choisi : ' + currentGame.username);

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


  var key_symbol_save = null;
  var keychain_save = null;
  function announcePublicKey(){

    // Save the key and keychain img.
    key_symbol_save = playerBoardColorInfo['key-symbol'];
    keychain_save = playerBoardColorInfo['keychain'];

    playerBoardColorInfo['key-symbol'] = 'icn-mini-player-key-symbol';
    playerBoardColorInfo['keychain'] = 'keychain-player';

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
    prepareCreateKeyScene(currentGame.director);

    $("body").closeAllDialogs(function(){
      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog(announcePublicKeyDialog);   
            
      });

    });

  }

  function hereYourPrivateKey() {

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
        currentGame.scenes['create_key_scene'].add_key_symbol(currentGame.director, currentGame.scenes['create_key_scene']);

        $(".wrapper.active .vertical-centering").dialog(hereYourPrivateKeyDialog);
      });
    });
  }

  function fallSixTimes() {
    $("body").closeAllDialogs(function(){
      $.switchWrapper('#bg-circuits', function(){
        $(".wrapper.active .vertical-centering").dialog(fallSixTimesDialog);
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


  function activatePause(dataScene, hookName, pauseFunction) {
    if (dataScene.scene.isPaused() === false) {
      dataScene.scene.setPaused(true);
      dataScene.needStopPaused = true;
    } else {
      dataScene.needStopPaused = false;
    }
    currentGame[hookName] = false;


    var pauseInfo = {
      'sceneName' : dataScene,
      'hookName' : hookName
    };
    pauseFunction(pauseInfo);
  }

  function deActivatePause(dataScene, hookName) {
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

  $(document).on("pauseCreateKeyEvent", function() {
    activateHelp(currentGame.scenes.create_key_scene, "createKeySceneActive", pauseCreateKey);
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
          content: "Pour générer ta clé publique, manipule ta clé privée avec <img src='img/icn-arrow-left.png' class='keyboard-key'>, <img src='img/icn-arrow-up.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png' class='keyboard-key'> puis fais-la tomber six ou sept fois avec la touche <img src='img/icn-arrow-down.png' class='keyboard-key'>.",
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

  function pauseCreateKey() {

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){
        $(".wrapper.active .vertical-centering").dialog({
          type: "player",
          title: "Pause",
          content: [
            {
            label: "Reprendre", 
            class: "not-asked",
            onClick: function() {
              deActivatePause(currentGame.scenes.create_key_scene, "createKeySceneActive");
            }},
            {
              label: "Menu Arcade",
              class: "not-asked",
              onClick: function() {
                menu();
                setTimeout(currentGame.scenes.create_key_scene.scene.setPaused(false), 1500);
              }
            },
            {
              label: "Menu Principal",
              class: "not-asked",
              onClick: function() {
                window.location = "/";
              }
            }]

        });
  

      });

    });
  }

  function switchToCreateKey() {
    // Start the increase of time.
    $(document).trigger('startTime', currentGame.scenes.create_key_scene.scene);


    $("body").closeAllDialogs();
    // Enable the action on the key.
    currentGame.createKeySceneActive = true;

    var waitToContinue = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
      function(time, ttime, timerTask) {
        if (currentGame.scenes.create_key_scene.game_box.crypt_key.numberApplied >= currentGame.maxNewKeyMove && currentGame.scenes.create_key_scene.game_box.message.isBlank() === false) {
          waitToContinue.cancel();
          currentGame.createKeySceneActive = false;
          keyPreGenerated();
        }
      }
    );
  }


  function keyPreGenerated() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(keyPregeneratedDialog);
      });
    });
  }

  function switchToFinishCreateKey() {
    $("body").closeAllDialogs();
    // Launch the ia.

    currentGame.scenes.create_key_scene.game_box.boxOption.timeInfo = createKeyIASceneTime;
    ia_create_pk(currentGame.scenes.create_key_scene.scene, currentGame.scenes.create_key_scene.game_box);

    var keyScore = score(currentGame.scenes.create_key_scene.game_box.message.getNumbers());
    ga('send', 'event', 'Arcade', 'Création clé publique', 'Score de la clé : ' + keyScore);
    console.log('Arcade - Création clé publique - Score de la clé : ' + keyScore);
    
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
            $(document).trigger('freezeTime', {'scene' : currentGame.scenes.create_key_scene.scene, 'timeLabel' : 'createKeySceneActiveTime'});

            currentGame.dontShowKey = false;
          }, 2000);
        }
      }
    );
  }

  function endCreateKey(){
    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        playerBoardColorInfo['key-symbol'] = key_symbol_save;
        playerBoardColorInfo['keychain'] = keychain_save;
        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='img/avatar-chercheuse.jpg'>",

          title: "Chercheuse",
          content: "Parfait ! Te voilà fin prêt! J’ai bien ta clé publique, nous pouvons passer à la suite.",
          identifier: {
            category: "Arcade",
            action: "Création clé publique",
            label: "Dialogue 'J'ai bien ta clé publique' (Chercheuse)",
          },
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
    goToBattleScene(currentGameOverData.sceneName, currentGameOverData.onDecrypt, currentGameOverData.sizeBoard, currentGameOverData.hookName, currentGameOverData.withIaBoard, currentGameOverData.timeInfo, currentGameOverData.message, currentGameOverData.helpEvent, currentGameOverData.pauseEvent, currentGameOverData.timeout);
    saveScene.setExpired(true);
    $("body").closeAllDialogs(function() {});
    currentGame.scenes[currentGameOverData.sceneName].scene.setPaused(false);
    $(document).trigger('startTime', currentGame.scenes[currentGameOverData.sceneName].scene);
    currentGame.scenes[currentGameOverData.sceneName].add_key_symbol(currentGame.director, currentGame.scenes[currentGameOverData.sceneName]);
    currentGame[currentGameOverData.hookName] = true;
    currentGame.iaPlay = true;
  }

  function gameOverDialog() {

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){
        var content = "Il faut vraiment que tu puisses décrypter ce message avant l'ordinateur. Reprennons de zéro !";
        if (currentGame.playerKeyType === 'public') {
          content = "Tu n'y arrives pas ? C'est peut-être normal ! Je te rappelle le principe de la cryptographie asymétrique : la clé secrète rend le déchiffrement facile, mais c'est très difficile voire impossible avec la clé publique. Choisi bien à qui tu donnes quelle clé!";
        }
        $(".wrapper.active .vertical-centering").dialog({

          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='img/avatar-chercheuse.jpg'>",

          title: "Chercheuse",
          content: content,
          controls: [{
            label: "Recommencer", 
            class: "button blue",
            onClick: stopGameOverDialog
          },
          {
            label: "Abandonner",
            class: "button red",
            onClick: menu
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
            onClick: menu
          }]

        });

      });

    });
  }

  function goToBattleScene(sceneName, onDecrypt, sizeBoard, hookName, withIaBoard, timeInfo, message, helpEvent, pauseEvent, timeout) {

    // Prepare the sceneName and set it as the current scene.
    preparePlayScene(currentGame.director, sizeBoard, sceneName, message, hookName, withIaBoard, helpEvent, pauseEvent);
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
            'pauseEvent' : pauseEvent,
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

      $.switchWrapper('#bg-circuits', function(){

        // Display the battle scene in background.
        goToBattleScene('play_min_scene', dialogDecryptedMessage1, MIN_BOARD_LENGTH, 'playMinSceneActive', true, false, currentGame.play_min_scene_msg, 'playMinHelpEvent', 'playMinPauseEvent');
        
        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "InriOS 3.14",
          content: (function(){
            var t = board_message_to_string(currentGame.play_min_scene_msg.plain_message),
                a = t.split(' '),
                o = '';

                for (var i = 0; i<a.length; i++) {
                    if(a[i] != '') o += "<span class='letter-block crypted crypted-message'>"+a[i]+"</span>";
                }

                return o;
          }()),
                
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

  $(document).on("playMinPauseEvent", function() {
    activatePause(currentGame.scenes.play_min_scene, "playMinSceneActive", pauseDialog);
  });

  function pauseDialog(pauseInfo) {

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        /*
         * To use analytics here, adapt below
         */

        if (pauseInfo.sceneName === currentGame.scenes.play_min_scene) {
          // We are in the 8 blocks level.
          console.log("8blocks");
        } else if (pauseInfo.sceneName === currentGame.scenes.play_medium_scene) {
          // We are in the 10 blocks level.
          console.log("10blocks");
        } else if (pauseInfo.sceneName === currentGame.scenes.play_max_scene) {
          // We are in the 12 blocks level.
          console.log("12blocks");
        } else if (pauseInfo.sceneName === currentGame.scenes.play_super_max_scene) {
          // We are in the 14 blocks level.
          console.log("14blocks");
        } else if (pauseInfo.sceneName === currentGame.scenes.play_mega_max_scene) {
          // We are in the 16 blocks level.
          console.log("16blocks");
        }

        $(".wrapper.active .vertical-centering").dialog({
          type: "player",
          title: "Pause",
          content: [
            {
              label: "Reprendre", 
              class: "not-asked",
              onClick: function() {
                deActivatePause(pauseInfo.sceneName, pauseInfo.hookName);
              }
            },
            {
              label: "Menu Arcade",
              class: "not-asked",
              onClick: function() {
                menu();
                setTimeout(currentGame.scenes.create_key_scene.scene.setPaused(false), 1500);
              }
            },
            {
              label: "Menu Principal",
              class: "not-asked",
              onClick: function() {
                window.location = "/";
              }
            }
          ]

        });
  

      });

    });
  }

  function playLevel1(){
    // Activate the timer.
    $(document).trigger('startTime', currentGame.scenes.play_min_scene.scene);

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
        var randLetter = null;
        var o = "";
        var t = "Premier challenge décrypté : " + FIRST_CHALLENGE_MESSAGE;
       
        // we need to do it once more;
        t = $('<div></div>').html(t).text();

        for (var i = 0; i < t.length; i++) {
          randLetter = String.fromCharCode(Math.round(Math.random() * 224) + 32);
          o += "<span class='letter-block crypted'>" + randLetter + "</span>";
        }

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "Challenge réussi",
          content: o,

          transitionCallback: {
            in: function() {
              // alert("Dialog was added to the dom");
            },
            show: function() {
              // alert("Dialog intro animation is complete");
              $.simulateDecrypt($(".dialog .content .text"), "Premier challenge décrypté : " + FIRST_CHALLENGE_MESSAGE, 2, -2);
            },
            out: function() {
              // alert("Dialog outro animation is complete, html element will be removed now.");
            }
          },

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


      $.switchWrapper('#bg-circuits', function(){

        // Display the battle scene in background.
        goToBattleScene('play_medium_scene', dialogDecryptedMessage2, MEDIUM_BOARD_LENGTH, 'playMediumSceneActive', true, false, currentGame.play_medium_scene_msg, 'playMediumHelpEvent', 'playMediumPauseEvent');

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "InriOS 3.14",
          content: (function(){
            var t = board_message_to_string(currentGame.play_medium_scene_msg.plain_message),
                a = t.split(' '),
                o = '';

                for (var i = 0; i<a.length; i++) {
                    if(a[i] != '') o += "<span class='letter-block crypted crypted-message'>"+a[i]+"</span>";
                }

                return o;
          }()),
                
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
  $(document).on("playMediumPauseEvent", function() {
    activatePause(currentGame.scenes.play_medium_scene, "playMediumSceneActive", pauseDialog);
  });


  function playLevel2(){
    // Activate the timer.
    $(document).trigger('startTime', currentGame.scenes.play_medium_scene.scene);

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

        var randLetter = null;
        var o = "";
        var t = "Deuxième challenge décrypté : " + SECOND_CHALLENGE_MESSAGE;
       
        // we need to do it once more;
        t = $('<div></div>').html(t).text();

        for (var i = 0; i < t.length; i++) {
          randLetter = String.fromCharCode(Math.round(Math.random() * 224) + 32);
          o += "<span class='letter-block crypted'>" + randLetter + "</span>";
        }
        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "Challenge réussi",
          content: o,

          transitionCallback: {
            in: function() {
              // alert("Dialog was added to the dom");
            },
            show: function() {
              // alert("Dialog intro animation is complete");
              $.simulateDecrypt($(".dialog .content .text"), "Deuxième challenge décrypté : " + SECOND_CHALLENGE_MESSAGE, 2, -2);
            },
            out: function() {
              // alert("Dialog outro animation is complete, html element will be removed now.");
            }
          },
                
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


      $.switchWrapper('#bg-circuits', function(){

        // Display the battle scene in background.
        goToBattleScene('play_max_scene', dialogDecryptedMessage3, MAX_BOARD_LENGTH, 'playMaxSceneActive', true, false, currentGame.play_max_scene_msg, 'playMaxHelpEvent', 'playMaxPauseEvent');

        $(".wrapper.active .vertical-centering").dialog({

          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "InriOS 3.14",
          content: (function(){
            var t = board_message_to_string(currentGame.play_max_scene_msg.plain_message),
                a = t.split(' '),
                o = '';

                for (var i = 0; i<a.length; i++) {
                    if(a[i] != '') o += "<span class='letter-block crypted crypted-message'>"+a[i]+"</span>";
                }

                return o;
          }()),
            
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

  $(document).on("playMaxPauseEvent", function() {
    activatePause(currentGame.scenes.play_max_scene, "playMaxSceneActive", pauseDialog);
  });


  function playLevel3(){
    // Activate the timer.
    $(document).trigger('startTime', currentGame.scenes.play_max_scene.scene);

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

        var randLetter = null;
        var o = "";
        var t = "Troisième challenge décrypté : " + THIRD_CHALLENGE_MESSAGE;
       
        // we need to do it once more;
        t = $('<div></div>').html(t).text();

        for (var i = 0; i < t.length; i++) {
          randLetter = String.fromCharCode(Math.round(Math.random() * 224) + 32);
          o += "<span class='letter-block crypted'>" + randLetter + "</span>";
        }
        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "Challenge réussi",
          content: o,
                
          transitionCallback: {
            in: function() {
              // alert("Dialog was added to the dom");
            },
            show: function() {
              // alert("Dialog intro animation is complete");
              $.simulateDecrypt($(".dialog .content .text"), "Troisième challenge décrypté : " + THIRD_CHALLENGE_MESSAGE, 3, -3);
            },
            out: function() {
              // alert("Dialog outro animation is complete, html element will be removed now.");
            }
          },
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

      $.switchWrapper('#bg-circuits', function(){

        // Display the battle scene in background.
        goToBattleScene('play_super_max_scene', dialogDecryptedMessage4, SUPER_MAX_BOARD_LENGTH, 'playSuperMaxSceneActive', true, false, currentGame.play_super_max_scene_msg, 'playSuperMaxHelpEvent', 'playSuperMaxPauseEvent');

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "InriOS 3.14",
          content: (function(){
            var t = board_message_to_string(currentGame.play_super_max_scene_msg.plain_message),
                a = t.split(' '),
                o = '';

                for (var i = 0; i<a.length; i++) {
                    if(a[i] != '') o += "<span class='letter-block crypted crypted-message'>"+a[i]+"</span>";
                }

                return o;
          }()),
                
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

  $(document).on("playSuperMaxPauseEvent", function() {
    activatePause(currentGame.scenes.play_super_max_scene, "playSuperMaxSceneActive", pauseDialog);
  });

  function playLevel4(){
    // Activate the timer.
    $(document).trigger('startTime', currentGame.scenes.play_super_max_scene.scene);

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

        var randLetter = null;
        var o = "";
        var t = "Quatrième challenge décrypté : " + FOURTH_CHALLENGE_MESSAGE;
       
        // we need to do it once more;
        t = $('<div></div>').html(t).text();

        for (var i = 0; i < t.length; i++) {
          randLetter = String.fromCharCode(Math.round(Math.random() * 224) + 32);
          o += "<span class='letter-block crypted'>" + randLetter + "</span>";
        }
        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "Challenge réussi",
          content: o,
          transitionCallback: {
            in: function() {
              // alert("Dialog was added to the dom");
            },
            show: function() {
              // alert("Dialog intro animation is complete");
              $.simulateDecrypt($(".dialog .content .text"), "Quatrième challenge décrypté : " + FOURTH_CHALLENGE_MESSAGE, 3, -3);
            },
            out: function() {
              // alert("Dialog outro animation is complete, html element will be removed now.");
            }
          },
                
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

      $.switchWrapper('#bg-circuits', function(){

        // Display the battle scene in background.
        goToBattleScene('play_mega_max_scene', dialogDecryptedMessage5, MEGA_MAX_BOARD_LENGTH, 'playMegaMaxSceneActive', true, false, currentGame.play_mega_max_scene_msg, 'playMegaMaxHelpEvent', "playMegaMaxPauseEvent");

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "InriOS 3.14",
          content: (function(){
            var t = board_message_to_string(currentGame.play_mega_max_scene_msg.plain_message),
                a = t.split(' '),
                o = '';

                for (var i = 0; i<a.length; i++) {
                    if(a[i] != '') o += "<span class='letter-block crypted crypted-message'>"+a[i]+"</span>";
                }

                return o;
          }()),
                
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
  $(document).on("playMegaMaxPauseEvent", function() {
    activatePause(currentGame.scenes.play_mega_max_scene, "playMegaMaxSceneActive", pauseDialog);
  });

  function playLevel5(){
    // Activate the timer.
    $(document).trigger('startTime', currentGame.scenes.play_mega_max_scene.scene);

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

        var randLetter = null;
        var o = "";
        var t = "Cinquième challenge décrypté : " + FIFTH_CHALLENGE_MESSAGE;
       
        // we need to do it once more;
        t = $('<div></div>').html(t).text();

        for (var i = 0; i < t.length; i++) {
          randLetter = String.fromCharCode(Math.round(Math.random() * 224) + 32);
          o += "<span class='letter-block crypted'>" + randLetter + "</span>";
        }
        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: "Challenge réussi",
          content: o,
          transitionCallback: {
            in: function() {
              // alert("Dialog was added to the dom");
            },
            show: function() {
              // alert("Dialog intro animation is complete");
              $.simulateDecrypt($(".dialog .content .text"), "Cinquième challenge décrypté : " + FIFTH_CHALLENGE_MESSAGE, 4, -4);
            },
            out: function() {
              // alert("Dialog outro animation is complete, html element will be removed now.");
            }
          },
                
          controls: [{
            label: "Menu principal", 
            class: "button blue",
            onClick: menu
          }]

        });   

      });

    });

  }       


  // Log event to google analytics
  ga('send', 'event', 'Arcade', 'Début du mode arcade', '');
  console.log('Arcade - Début du mode arcade');

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

  function addControlToDialogs() {
    addControlToDialog(announcePublicKeyDialog, [{label: labelNext, class: "button blue", onClick: hereYourPrivateKey}]);
    addControlToDialog(hereYourPrivateKeyDialog, [{label: labelNext, class: "button blue", onClick: fallSixTimes}]);
    addControlToDialog(fallSixTimesDialog, [{label: labelNext, class: "button blue", onClick: switchToCreateKey}]);
    addControlToDialog(keyPregeneratedDialog, [{label: labelNext, class: "button blue", onClick: switchToFinishCreateKey}]);

  }
  addControlToDialogs();


  function deactivateMenu() {
    var allItems = ['item-public-key', 'item-8-board', 'item-10-board', 'item-12-board', 'item-14-board', 'item-16-board'];
    for (var i = 0; i < allItems.length; ++i) {
      $('#' + allItems[i]).removeClass('active');
    }
  }

  function menu() {

    // Log event to google analytics
    ga('send', 'event', 'Arcade', 'Affichage du menu', '');
    console.log('Arcade - Affichage du menu');
  
    $("body").closeAllDialogs(function(){
      $.switchWrapper('#menu-view', function() {
        // -- switch to waiting scene.
        if (currentGame.scenes != null) {
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
        }
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
