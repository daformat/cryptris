/********************************************************************
 * Ensure that below files are included (in the same order) for the *
 * good behavior of this piece of code :                            *
 *     - message_columns.js                                         *
 *     - key_columns.js                                             *
 *     - menu_screen.js                                             *
 *     - play_scene.js                                              *
 *******************************************************************/

function handle_ia(playScene, rivalBoxInfo) {	              
    var prepare_move = [];
    var move = [];

    var message = rivalBoxInfo.message;
    var key = rivalBoxInfo.crypt_key;

    for (var i = 0; i < key.length; ++i) {
        move.push(0);
    }
    var index = 0;

    var keyIsInvert = false;
    var moveIsPrepared = false;

    var progress = true;

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
            if (key.msgColumn.resolved === false && key.keyInMove === false && key.keyFirstMove === false) {
                /**
                 * TO PRECISE : We apply -2 key at all columns of the message.
                 */
                if (moveIsPrepared !== true) {
                    if (keyIsInvert !== true) {
                        keyIsInvert = !keyIsInvert;
                        ia.addMoveInvert();
                    } else if (move[index] !== -2) {
                        ia.addMoveDown();
                        move[index] = move[index] - 1;
                    } else if (move[index] === -2) {
                        if (index < move.length - 1) {
                            ++index;
                            ia.addMoveRight();
                        } else {
                            moveIsPrepared = true;
                            progress = true;
                            index = move.length - 1;
                        }
                    }
                } else {    
                    if (progress === true) {
                        if (index !== move.length - 1) {
                            ia.addMoveRight();
                            ++index;
                        } else {
                            if (keyIsInvert === true) {
                                ia.addMoveInvert();
                                keyIsInvert = !keyIsInvert;
                            } else if (move[index] !== 2) {
                                ia.addMoveDown();
                                move[index] = move[index] + 1;
                            } else if (move[index] === 2) {
                                progress = false;
                                align_column = true;
                            }
                        }
                    } else {
                        if (align_column === true) {
                            if (keyIsInvert !== true) {
                                ia.addMoveInvert();
                                keyIsInvert = !keyIsInvert;
                            } else if (move[index] !== -2) {
                                ia.addMoveDown();
                                move[index] = move[index] - 1;
                            } else if (move[index] === -2) {
                                ia.addMoveLeft();
                                align_column = false;
                                --index;
                            }
                        } else {
                            if (move[index] === 2) {
                                align_column = true;
                            } else {
                                if (keyIsInvert === true) {
                                    ia.addMoveInvert();
                                    keyIsInvert = !keyIsInvert;
                                } else {
                                    ia.addMoveDown();
                                    move[index] = move[index] + 1;
                                    progress = true;
                                }
                            }
                        }
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
