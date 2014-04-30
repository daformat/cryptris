/********************************************************************
 * Ensure that below files are included (in the same order) for the *
 * good behavior of this piece of code :                            *
 *     - message_columns.js                                         *
 *     - key_columns.js                                             *
 *     - menu_screen.js                                             *
 *     - play_scene.js                                              *
 *******************************************************************/

function ia_create_pk(createKeyScene, gameBoxInfo, activateIa) {
  if (currentGame.iaCreateKeyTimer != null) {
    return ;
  }

  var message = gameBoxInfo.message;
  var key = gameBoxInfo.crypt_key;

  if (activateIa === true) {
    var ia = new IA(createKeyScene, key, message, gameBoxInfo.boxOption);
    ia.blankMessageIsAllowed = true;
    
    ia.addMoveInvert();
    for (var i = 0; i < key.all_moves.length; ++i) {
      var move = key.all_moves[key.all_moves.length - i - 1];
      
      if (move === ia.ACTION_LEFT) {
        ia.addMoveRight();
      } else if (move === ia.ACTION_RIGHT) {
        ia.addMoveLeft();
      } else if (move === ia.ACTION_DOWN) {
        ia.addMoveDown();
      } else if (move === ia.ACTION_INVERT) {
        ia.addMoveInvert();
      }
    }
    for (var i = 0; i < 5; i++) {
      ia.addMoveDown();
      ia.addMoveInvert();
      ia.addMoveLeft();
    }
    ia.addWaitForKeyHidden();
    ia.addMoveDown();
    ia.startIA();
  } else {
    key.hidden();
  }

  var finishCreateKeyTimer = createKeyScene.createTimer(0, Number.MAX_VALUE, null,
    function(time, ttime, timerTask) {
      if (!activateIa || (ia.moveList.length === 0 && key.msgColumn.resolved === false && key.keyInMove === false && key.keyFirstMove === false)) {
        finishCreateKeyTimer.cancel();

        // destroy private key symbol.
        gameBoxInfo.gameBox.removeChild(gameBoxInfo.keySymbol);

        message.upMessage();

        // Make a key to appear.
        var gameBox = gameBoxInfo.gameBox;

        var keySymbolImg = currentGame.director.getImage('icn-mini-ia-key-symbol');
        var keySymbolActor = new CAAT.ActorContainer().setSize(keySymbolImg.width, keySymbolImg.height)
                                              .setLocation(-keySymbolImg.width, gameBox.y - (keySymbolImg.height - 10) / 2 + gameBoxInfo.boxOption.BORDER_HEIGHT);
        var keySymbol = new CAAT.Actor().setBackgroundImage(currentGame.director.getImage('icn-mini-ia-key-symbol'));
        var keychainSymbol = new CAAT.Actor().setBackgroundImage(currentGame.director.getImage('keychain-ia')).setLocation(-45, 5);

        var keychainPath = new CAAT.CurvePath().setQuadric(keychainSymbol.x, keychainSymbol.y, keychainSymbol.x, keychainSymbol.y + 15, keychainSymbol.x + 15, keychainSymbol.y + 26);
        var keychainPb = new CAAT.PathBehavior().setPath(keychainPath).setFrameTime(gameBox.time + 125, 500).setCycle(false);
        var keychainRotate = new CAAT.RotateBehavior().setValues(0, -1 * Math.PI / 3).setFrameTime(gameBox.time + 125, 500).setCycle(false);
        
        keychainSymbol.addBehavior(keychainPb);
        keychainSymbol.addBehavior(keychainRotate);

        keySymbolActor.addChild(keySymbol);
        keySymbolActor.addChild(keychainSymbol);
        currentGame.scenes.create_key_scene.keySymbol = keySymbolActor;
        createKeyScene.addChild(currentGame.scenes.create_key_scene.keySymbol);

        var path =  new CAAT.LinearPath().setInitialPosition(keySymbolActor.x, keySymbolActor.y).setFinalPosition(gameBox.x - keySymbolImg.width + gameBoxInfo.boxOption.BORDER_WIDTH, keySymbolActor.y - 2);
        var pb = new CAAT.PathBehavior().setPath(path).setFrameTime(createKeyScene.time, gameBoxInfo.boxOption.timeInfo.keyAppearTime).setCycle(false);
        pb.setInterpolator(CAAT.Behavior.Interpolator.enumerateInterpolators()[16]);

        var alphaD = new CAAT.AlphaBehavior().setValues(1,0).setCycle(false);
        var alphaC = new CAAT.AlphaBehavior().setValues(0,1).setCycle(false);

        var alphaCBehaviorListener = {
          'behaviorExpired' : function(behavior, time, actor) {
                                if (currentGame.nbrKeyClipping < currentGame.maxKeyClipping - 1) {
                                  keySymbol.addBehavior(alphaD.setFrameTime(time, gameBoxInfo.boxOption.timeInfo.keyClippingTime / 2));
                                  keychainSymbol.addBehavior(alphaD.setFrameTime(time, gameBoxInfo.boxOption.timeInfo.keyClippingTime / 2));
                                  currentGame.nbrKeyClipping = currentGame.nbrKeyClipping + 1;
                                } else {
                                  currentGame.goToNextDialog = true;
                                }
                              },
          'behaviorApplied' : null
        };
        alphaC.addListener(alphaCBehaviorListener);

        var alphaDBehaviorListener = {
          'behaviorExpired' : function(behavior, time, actor) {
                                keySymbol.addBehavior(alphaC.setFrameTime(time, gameBoxInfo.boxOption.timeInfo.keyClippingTime / 2));
                                keychainSymbol.addBehavior(alphaC.setFrameTime(time, gameBoxInfo.boxOption.timeInfo.keyClippingTime / 2));
                              },
          'behaviorApplied' : null
        };
        alphaD.addListener(alphaDBehaviorListener);

        var behaviorListener = {
          'behaviorExpired' : function(behavior, time, actor) {
                                keySymbol.addBehavior(alphaD.setFrameTime(time, gameBoxInfo.boxOption.timeInfo.keyClippingTime / 2));
                                keychainSymbol.addBehavior(alphaD.setFrameTime(time, gameBoxInfo.boxOption.timeInfo.keyClippingTime / 2));
                                currentGame.keyIsInPlace = true;
                              }, 
          'behaviorApplied' : null
        };

        pb.addListener(behaviorListener);
        keySymbolActor.addBehavior(pb);

        // ---
        var newPk = [];
        for (var i = 0; i < message.columnList.length; ++i) {
          if (message.columnList[i].type === COLUMN_TYPE_1) {
            newPk.push(message.columnList[i].squareNumber);
          } else if (message.columnList[i].type === COLUMN_TYPE_2) {
            newPk.push(-1 * message.columnList[i].squareNumber);
          } else {
            newPk.push(0);
          }
        }
        resetPublicKey(newPk, indexToReset);
      }
    }
  );
}

function resizeCreateKeyScene(director, createKeyScene) {
    if (currentGame.displayKey === false) {
        createKeyScene.game_box.relativeX = getRelativeX(createKeyScene.resizeOption);
        createKeyScene.game_box.resize(createKeyScene.scene)

        createKeyScene.info_column.redraw();

        if (currentGame.scenes.create_key_scene != null && currentGame.scenes.create_key_scene.keySymbol != null && currentGame.keyIsInPlace === true) {

            var gameBox = createKeyScene.game_box.gameBox;
            var boxOption = createKeyScene.game_box.boxOption;
            var keySymbolImg = director.getImage('key-symbol');
            currentGame.scenes.create_key_scene.keySymbol.setLocation(gameBox.x - keySymbolImg.width + 16 + boxOption.BORDER_WIDTH, gameBox.y - (keySymbolImg.height - 10) / 2 + boxOption.BORDER_WIDTH);
        }
    }
}

function addKeySymbol(director, playScene) {
    playScene.game_box.addKeySymbol();

    if (playScene.rival_box != null) {
        playScene.rival_box.addKeySymbol();
    }
    playScene.resize(director, playScene);
}

/**
 * This function all elements for the play scene.
 * @param director {CAAT.Director}
 */
function createCreateKeyScene(director, current_length, empty_message, keyInfo, hookActive, helpEvent, pauseEvent) {
    /**
     * Create the dict to return.
     */
    var resultScene = {};
    /**
     * Create the play scene.
     */
    resultScene.scene = director.createScene();
     
    /*
     * Deactivate all scenes and activate this scene.
     */
    resultScene.scene.activated = function() {
        currentGame.deactivateScenes(hookActive);
        if (resultScene.resize != null) {
            resultScene.resize(director, resultScene);
        }
    }

    /**
     * Define the board resize option.
     */
    resultScene.resizeOption = new ResizeOption(current_length, 1);

    /**
     * Create the player game board.
     */
    var playerBoxOption = new BoxOption(resultScene.scene, resultScene.resizeOption, playerBoardColorInfo, createKeySceneTime);
    var gameBoxInfo = new GameBox(director, playerBoxOption, getRelativeX(resultScene.resizeOption), resultScene.resizeOption.DEFAULT_RELATIVE_Y, current_length, keyInfo.private_key[current_length], empty_message, true, false, true);
    resultScene['game_box'] = gameBoxInfo;

    /**
     * Create the central column (to display some information).
     */
    var infoColumn = new InfoColumn(director, resultScene, gameBoxInfo.crypt_key, true);
    resultScene['info_column'] = infoColumn;

    /*
     * Bind each element of the scene with controls (mouse and keyboard.)
     */

    // Bind the key with keyboard controls.
    bindCKPlayerKeyWithKeyboard(ia_create_pk, resultScene.scene, gameBoxInfo, hookActive)


    // Bind infoColumn pad with controls.
    bindCKPadWithKey(infoColumn.pad, director, ia_create_pk, resultScene.scene, gameBoxInfo, hookActive);
    bindPadWithKeyboard(infoColumn.pad, director, hookActive);

    // Bind all objects with pause Buttons.
    bindPauseButton(infoColumn.pauseButton, director, hookActive, pauseEvent);

    // Bind default help button (do nothing).
    bindHelpButton(infoColumn.helpButton, director, hookActive, helpEvent);


    /**
     * Set the addKeySymbol callback to call.
     */
    resultScene['add_key_symbol'] = addKeySymbol;

    /**
     * Add each element to its scene.
     */
    resultScene.scene.addChild(resultScene['game_box'].gameBox);

    /**
     * Set the resize callback to call.
     */
    resultScene['resize'] = resizeCreateKeyScene;

    if (director.height < 700) {
        currentGame.miniScreen = true;
    } else {
        currentGame.miniScreen = false;
    }
    resizeCreateKeyScene(director, resultScene);
    return resultScene;
}
