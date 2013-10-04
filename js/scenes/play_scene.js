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

    var current_time = 0;
    var WAITING_TIME = rivalBoxInfo.boxOption.timeInfo.waitingIATime;

    var ACTION_UNKNOWN = -1;
    var ACTION_LEFT = 0;
    var ACTION_RIGHT = 1;
    var ACTION_DOWN = 2;
    var ACTION_INVERT = 3;
    var ACTION_AFTER_DOWN = 4;

    var message = rivalBoxInfo.message;
    var key = rivalBoxInfo.crypt_key;

    var actionToDo = ACTION_UNKNOWN;

    for (var i = 0; i < key.length; ++i) {
        move.push(0);
    }
    var index = 0;

    var keyIsInvert = false;
    var moveIsPrepared = false;

    var alignColumn = false;
    var progress = true;

    var decryptMsgTimer = playScene.createTimer(0, Number.MAX_VALUE, null,
        function(time, ttime, timerTask) {

            if (key.msgColumn.resolved === false && key.keyInMove === false && key.keyFirstMove === false) {
                /**
                 * TO PRECISE : We apply -2 key at all columns of the message.
                 */
                if (actionToDo === ACTION_UNKNOWN && moveIsPrepared !== true) {
                    if (actionToDo === ACTION_UNKNOWN) {
                        if (keyIsInvert !== true) {
                            actionToDo = ACTION_INVERT;
                        } else if (move[index] !== -2) {
                            actionToDo = ACTION_DOWN;
                            move[index] = move[index] - 1;
                        } else if (move[index] === -2) {
                            if (index < move.length - 1) {
                                ++index;
                                actionToDo = ACTION_RIGHT;
                            } else {
                                moveIsPrepared = true;
                                actionToDo = ACTION_UNKNOWN;
                                progress = true;
                                index = move.length - 1;
                            }
                        }
                    }
                    current_time = time;
                } else if (actionToDo === ACTION_UNKNOWN && moveIsPrepared === true) {    
                    if (progress === true) {
                        if (actionToDo === ACTION_UNKNOWN) {
                            if (index !== move.length - 1) {
                                actionToDo = ACTION_RIGHT;
                                ++index;
                            } else {
                                if (keyIsInvert === true) {
                                    actionToDo = ACTION_INVERT;
                                } else if (move[index] !== 2) {
                                    actionToDo = ACTION_DOWN;
                                    move[index] = move[index] + 1;
                                } else if (move[index] === 2) {
                                    actionToDo = ACTION_UNKNOWN;
                                    progress = false;
                                    align_column = true;
                                }
                            }
                        }
                    } else {
                        if (actionToDo === ACTION_UNKNOWN) {
                            if (align_column === true) {
                                if (keyIsInvert !== true) {
                                    actionToDo = ACTION_INVERT;
                                } else if (move[index] !== -2) {
                                    actionToDo = ACTION_DOWN;
                                    move[index] = move[index] - 1;
                                } else if (move[index] === -2) {
                                    actionToDo = ACTION_LEFT;
                                    align_column = false;
                                    --index;
                                }
                            } else {
                                if (move[index] === 2) {
                                    align_column = true;
                                } else {
                                    if (keyIsInvert === true) {
                                        actionToDo = ACTION_INVERT;
                                    } else {
                                        actionToDo = ACTION_DOWN;
                                        move[index] = move[index] + 1;
                                        progress = true;
                                    }
                                }
                            }
                        }
                    }
                    current_time = time;

                } else if ((time - current_time) > WAITING_TIME && actionToDo === ACTION_RIGHT) {
                    key.rotateRight();
                    actionToDo = ACTION_UNKNOWN;
                    current_time = time;
                } else if ((time - current_time) > WAITING_TIME && actionToDo === ACTION_LEFT) {
                    key.rotateLeft();
                    actionToDo = ACTION_UNKNOWN;
                    current_time = time;
                } else if ((time - current_time) > WAITING_TIME && actionToDo === ACTION_DOWN) {
                    key.keyDown();
                    actionToDo = ACTION_UNKNOWN;
                    current_time = time;
                } else if ((time - current_time) > WAITING_TIME && actionToDo === ACTION_INVERT) {
                    key.changeKeyType();
                    keyIsInvert = !keyIsInvert;
                    actionToDo = ACTION_UNKNOWN;
                    current_time = time;
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

/**
 * This function all elements for the play scene.
 * @param director {CAAT.Director}
 */
function createPlayScene(director, current_length, message, keyInfo, hookActive, withIaBoard) {
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
        currentGame.deactivateScenes();
        currentGame[hookActive] = true;
        if (resultScene.resize != null) {
            resultScene.resize(director, resultScene);
        }
    }
	 
    /**
     * Define the board resize option.
     */
    resultScene.resizeOption = new ResizeOption(current_length, withIaBoard ? 2 : 1);

    /**
     * Create the player game board.
     */
    var playerBoxOption = new BoxOption(resultScene.scene, resultScene.resizeOption, playerBoardColorInfo, playerPSceneTime);
    var gameBoxInfo = new GameBox(director, playerBoxOption, getRelativeX(resultScene.resizeOption), resultScene.resizeOption.DEFAULT_RELATIVE_Y, current_length, keyInfo.private_key[current_length], message, true, true);
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
        var rivalBoxInfo = new GameBox(director, rivalBoxOption, resultScene.game_box.gameBox.x + 260 + resultScene.game_box.gameBox.width, resultScene.resizeOption.DEFAULT_RELATIVE_Y, current_length, keyInfo.public_key[current_length], message, false, true);
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
    bindHelpButtonByDefault(infoColumn.helpButton, director, hookActive);

    /**
     * Set the resize callback to call.
     */
    resultScene['resize'] = resizePlayScene;

    /*
     * Call the IA script if necessary.
     */
    withIaBoard ? handle_ia(resultScene['scene'], rivalBoxInfo) : null;

    resultScene['scene'].createTimer(resultScene['scene'].time, Number.MAX_VALUE, null,
        function(time, ttime, timerTask) {
            if (withIaBoard) {
                var rivalMessage = rivalBoxInfo.message;
                var rivalPadlockIsFall = rivalBoxInfo.padlockIsFall;
                if (rivalMessage.boxOption.endResolved === null && rivalMessage.resolved === true && rivalPadLockIsFall === true) {
                    currentGame.gameOver = true;
                    rivalMessage.boxOption.endResolved = time;
                    rivalBoxInfo.addWinScreen("Message décrypté.", 200, 50);
                    resultScene.scene.setPaused(true);
                    currentGame[hookActive] = false;
                }
            }

            var gameMessage = gameBoxInfo.message;
            var gamePadlockIsFall = gameBoxInfo.padlockIsFall;
            if (gameMessage.boxOption.endResolved === null && gameMessage.resolved === true && gamePadlockIsFall === true) {
                currentGame.goToNextDialog = true;
                gameMessage.boxOption.endResolved = time; 
                gameBoxInfo.addWinScreen("Message décrypté.", 200, 50);
                resultScene.scene.setPaused(true);
                currentGame[hookActive] = false;
                console.log(hookActive);
            }
        }
    );
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
