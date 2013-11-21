/********************************************************************
 * Ensure that below files are included (in the same order) for the *
 * good behavior of this piece of code :                            *
 *     - message_columns.js                                         *
 *     - key_columns.js                                             *
 *     - menu_screen.js                                             *
 *     - play_scene.js                                              *
 *******************************************************************/

function handle_ia(playScene, rivalBoxInfo) {	              
    var message = rivalBoxInfo.message;
    var key = rivalBoxInfo.crypt_key;
    var currentLength = rivalBoxInfo.current_length;

    var MINIMUM_STROKE = 10;
    var lastModif = 0;
    var strokeNumber = 0;
    var rotationIndex = 0;

    var ia = new IA(playScene, key, message, rivalBoxInfo.boxOption);

    var decryptMsgTimer = playScene.createTimer(0, Number.MAX_VALUE, null,
        function(time, ttime, timerTask) {
            if (currentGame.iaPlay === false) {
                if (ia.iaState === ia.iaPlay) {
                    ia.stopIA();
                }
                return ;
            } else if (currentGame.iaPlay === true) {
                if (ia.iaState !== ia.iaPlay) {
                    ia.startIA();
                }
            }

            if (ia.moveList.length === 0 && key.msgColumn.resolved === false && key.keyInMove === false && key.keyFirstMove === false) {

                if (lastModif > currentLength || (strokeNumber < MINIMUM_STROKE && l2(message.getNumbers()) < 3 * l2(key.number))) {
                    lastModif = 0;

                    for (var i = 0; i < currentLength / 2; ++i) {
                        rotationIndex = Math.floor(Math.random() * (currentLength + 1));
                        for (var j = 0; j < rotationIndex; ++j) {
                            ia.addMoveRight();
                        }

                        if (Math.floor(Math.random() * 2) === 1) {
                            ia.addMoveInvert();
                            ia.addMoveDown();
                        } else {
                            ia.addMoveDown();
                        }
                    }
                    rotationIndex = 0;
                } else {

                    ++lastModif;
                    ++strokeNumber;

                    for (var i = 0; i < rotationIndex; ++i) {
                        ia.addMoveRight();
                    }

                    var l2_cmp = l2(message.getNumbers());

                    var tmpNumbers = message.getNumbers();
                    var tmpKey = key.number;

                    var tmpDistSub = l2(sum(tmpNumbers, mult(-1, tmpKey)));
                    var tmpDistAdd = l2(sum(tmpNumbers, tmpKey));

                    if (tmpDistSub < l2_cmp) {
                        ia.addMoveInvert();
                        ia.addMoveDown();
                    } else if (tmpDistAdd < l2_cmp) {
                        ia.addMoveDown();
                    } else {
                        rotationIndex = (rotationIndex + 1) % rivalBoxInfo.current_length;
                    }
                }

            } else if (key.msgColumn.resolved === true) {
                decryptMsgTimer.cancel();
            }
        }
    );
}

function resizePlayScene(director, playScene) {

    playScene.game_box.relativeX = getRelativeX(playScene.resizeOption);
    playScene.game_box.resize(playScene.scene);

    playScene.info_column.redraw();

    if (playScene.rival_box != null) {
        playScene.rival_box.relativeX = playScene.game_box.gameBox.x + 260 + playScene.game_box.gameBox.width;
        playScene.rival_box.resize(playScene.scene);
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
function createPlayScene(director, current_length, message, keyInfo, hookActive, withIaBoard, helpEvent) {
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
        currentGame.stopCreateKeyAfterResolve = true;
    }
	 
    /**
     * Define the board resize option.
     */
    resultScene.resizeOption = new ResizeOption(current_length, withIaBoard ? 2 : 1);

    /**
     * Create the player game board.
     */
    var playerBoxOption = new BoxOption(resultScene.scene, resultScene.resizeOption, playerBoardColorInfo, playerPSceneTime);
    var gameBoxInfo = new GameBox(director, playerBoxOption, getRelativeX(resultScene.resizeOption), resultScene.resizeOption.DEFAULT_RELATIVE_Y, current_length, keyInfo.private_key[current_length], message, true, true, hookActive);
    resultScene['game_box'] = gameBoxInfo;
    resultScene.scene.addChild(resultScene['game_box'].gameBox);

    /**
     * Create the central column (to display some information).
     */
    var infoColumn = new InfoColumn(director, resultScene, gameBoxInfo.crypt_key);
    resultScene['info_column'] = infoColumn;

    /**
     * Create the ia board if necessary.
     */
    if (withIaBoard) {
        var rivalBoxOption = new BoxOption(resultScene.scene, resultScene.resizeOption, iaBoardColorInfo, rivalPSceneTime);
        var rivalBoxInfo = new GameBox(director, rivalBoxOption, resultScene.game_box.gameBox.x + 260 + resultScene.game_box.gameBox.width, resultScene.resizeOption.DEFAULT_RELATIVE_Y, current_length, keyInfo.public_key[current_length], message, false, true, hookActive);
        resultScene['rival_box'] = rivalBoxInfo;
        resultScene.scene.addChild(resultScene['rival_box'].gameBox);
    }

    /*
     * Bind each element of the scene with controls (mouse and keyboard.)
     */
    
    // Bind the key with keyboard controls.
    bindPlayerKeyWithKeyboard(gameBoxInfo.crypt_key, hookActive);

    // Bind infoColumn pad with controls.
    bindPadWithKey(infoColumn.pad, director, gameBoxInfo.crypt_key, hookActive);
    bindPadWithKeyboard(infoColumn.pad, director, hookActive);

    // Bind all objects with pause Buttons.
    var objectsWithAnimation = withIaBoard ? [gameBoxInfo.crypt_key, gameBoxInfo.message, rivalBoxInfo.crypt_key, rivalBoxInfo.message] : [gameBoxInfo.crypt_key, gameBoxInfo.message];
    bindPauseButtonWithObjects(infoColumn.pauseButton, resultScene.scene, objectsWithAnimation, director, hookActive);

    // Bind default help button (do nothing).
    bindHelpButtonByDefault(infoColumn.helpButton, director, hookActive, helpEvent);

    /**
     * Set the resize callback to call.
     */
    resultScene['resize'] = resizePlayScene;

    /**
     * Set the addKeySymbol callback to call.
     */
    resultScene['add_key_symbol'] = addKeySymbol;

    /*
     * Call the IA script if necessary.
     */
    withIaBoard ? handle_ia(resultScene['scene'], rivalBoxInfo) : null;

    $(document).on('padlockIsFall', function() {
        if (withIaBoard) {
            var rivalMessage = rivalBoxInfo.message;
            var rivalPadlockIsFall = rivalBoxInfo.padlockIsFall;
            if (rivalMessage.boxOption.endResolved === null && rivalMessage.resolved === true && rivalPadlockIsFall === true) {
                currentGame.gameOver = true;
                rivalMessage.boxOption.endResolved = rivalBoxInfo.gameBox.time;
                rivalBoxInfo.addWinScreen("Message décrypté.", 200, 50, true, resultScene.scene, hookActive);
                gameBoxInfo.addWinScreen("Time Out.", 200, 50, false);
            }
        }

        var gameMessage = gameBoxInfo.message;
        var gamePadlockIsFall = gameBoxInfo.padlockIsFall;
        if (gameMessage.boxOption.endResolved === null && gameMessage.resolved === true && gamePadlockIsFall === true) {
            currentGame.goToNextDialog = true;
            gameMessage.boxOption.endResolved = gameBoxInfo.gameBox.time; 
            gameBoxInfo.addWinScreen("Message décrypté.", 200, 50, true, resultScene.scene, hookActive);

            if (withIaBoard) {
                rivalBoxInfo.addWinScreen("Time Out", 200, 50, false);
            }
        }
    });

    resizePlayScene(director, resultScene);
    return resultScene;
}

function getQuerystring(key, default_) {
  if (default_==null) default_=""; 
  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
  var qs = regex.exec(window.location.href);
  if(qs == null)
    return default_;
  else
    return qs[1];
}
