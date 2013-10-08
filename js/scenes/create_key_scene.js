/********************************************************************
 * Ensure that below files are included (in the same order) for the *
 * good behavior of this piece of code :                            *
 *     - message_columns.js                                         *
 *     - key_columns.js                                             *
 *     - menu_screen.js                                             *
 *     - play_scene.js                                              *
 *******************************************************************/

function ia_create_pk(createKeyScene, gameBoxInfo) {
    if (currentGame.iaCreateKeyTimer != null) {
        return ;
    }

    var prepare_move = [];
    var move = [];

    var current_time = 0;
    var WAITING_TIME = gameBoxInfo.boxOption.timeInfo.waitingIATime;

    var ACTION_UNKNOWN = -1;
    var ACTION_LEFT = 0;
    var ACTION_RIGHT = 1;
    var ACTION_DOWN = 2;
    var ACTION_INVERT = 3;
    var ACTION_AFTER_DOWN = 4;

    var message = gameBoxInfo.message;
    var key = gameBoxInfo.crypt_key;

    var actionToDo = ACTION_UNKNOWN;


    for (var i = 0; i < key.length; ++i) {
        move.push(Math.floor(Math.random() * 5) - 2);
    }

    move.push(-1);

    var index = 0;

    var keyIsInvert = false;
    var moveIsPrepared = false;

    var alignColumn = false;
    var progress = true;

    currentGame.iaCreateKeyTimer = createKeyScene.createTimer(0, Number.MAX_VALUE, null,
        function(time, ttime, timerTask) {


            if (index < move.length && key.keyInMove === false && key.keyFirstMove === false) {
 
                if (actionToDo === ACTION_UNKNOWN) {

                    if (move[index] === 0) {
                        if (keyIsInvert === true) {
                            actionToDo = ACTION_INVERT;
                        } else {
                            actionToDo = ACTION_RIGHT;
                            ++index;
                        }
                    } else {
                        if (move[index] < 0) {
                            actionToDo = ACTION_INVERT;
                            move[index] = -1 * move[index];
                        } else {
                            actionToDo = ACTION_DOWN;
                            move[index] = move[index] - 1;
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

                if( index == move.length - 1){
                    currentGame.dontShowKey = true;
                }

            } else if (index === move.length) {
  
                currentGame.iaCreateKeyTimer.cancel();


                var waitUpMessageToContinue = createKeyScene.createTimer(0, Number.MAX_VALUE, null,
                    function(time, ttime, timerTask) {
                        if (currentGame.displayKey === true) {
                            waitUpMessageToContinue.cancel();

                            // Display "Clé publique générée !"
                            gameBoxInfo.addWinScreen("Clé publique générée !", 300, 50, true);
                            var alphaScreen = new CAAT.AlphaBehavior().
                                                  setValues(0,1).
                                                  setCycle(false).
                                                  setFrameTime(gameBoxInfo.winScreen.time, 2000);
                            gameBoxInfo.winScreen.addBehavior(alphaScreen);
                        }
                    }
                );

                message.upMessage();
                key.hidden();


               // Make a key to appear.
                var gameBox = gameBoxInfo.gameBox;

                var keySymbolImg = currentGame.director.getImage('key-symbol');
                var keySymbolActor = new CAAT.Actor().setSize(keySymbolImg.width, keySymbolImg.height)
                                                                    .setBackgroundImage(currentGame.director.getImage('key-symbol'))
                                                                    .setLocation(-keySymbolImg.width, gameBox.y - (keySymbolImg.height - 10) / 2 + gameBoxInfo.boxOption.BORDER_HEIGHT);
                currentGame.scenes.create_key_scene.keySymbol = keySymbolActor;
                createKeyScene.addChild(currentGame.scenes.create_key_scene.keySymbol);

                var path =  new CAAT.LinearPath().setInitialPosition(keySymbolActor.x, keySymbolActor.y).setFinalPosition(gameBox.x - keySymbolImg.width + 8 + gameBoxInfo.boxOption.BORDER_WIDTH, keySymbolActor.y);
                var pb = new CAAT.PathBehavior().setPath(path).setFrameTime(createKeyScene.time, gameBoxInfo.boxOption.timeInfo.keyAppearTime).setCycle(false);
                pb.setInterpolator(CAAT.Behavior.Interpolator.enumerateInterpolators()[16]);

                var alphaD = new CAAT.AlphaBehavior().
                                                  setValues(1,0).
                                      setCycle(false);
                var alphaC = new CAAT.AlphaBehavior().
                                                  setValues(0,1).
                                      setCycle(false);


                var alphaCBehaviorListener = {
                    'behaviorExpired' : function(behavior, time, actor) {
                        if (currentGame.nbrKeyClipping < currentGame.maxKeyClipping - 1) {
                            keySymbolActor.addBehavior(alphaD.setFrameTime(time, gameBoxInfo.boxOption.timeInfo.keyClippingTime / 2));
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
                        keySymbolActor.addBehavior(alphaC.setFrameTime(time, gameBoxInfo.boxOption.timeInfo.keyClippingTime / 2));
                    },
                    'behaviorApplied' : null
                };
                alphaD.addListener(alphaDBehaviorListener);

                var behaviorListener = {
                    'behaviorExpired' : function(behavior, time, actor) {
                        keySymbolActor.addBehavior(alphaD.setFrameTime(time, gameBoxInfo.boxOption.timeInfo.keyClippingTime / 2));
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

/**
 * This function all elements for the play scene.
 * @param director {CAAT.Director}
 */
function createCreateKeyScene(director, current_length, empty_message, keyInfo, hookActive, helpEvent) {
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
        currentGame.createKeySceneActive = true;
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
    var gameBoxInfo = new GameBox(director, playerBoxOption, getRelativeX(resultScene.resizeOption), resultScene.resizeOption.DEFAULT_RELATIVE_Y, current_length, keyInfo.private_key[current_length], empty_message, true, false, hookActive);
    resultScene['game_box'] = gameBoxInfo;

    /**
     * Create the central column (to display some information).
     */
    var infoColumn = new InfoColumn(director, resultScene, gameBoxInfo.crypt_key);
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
    bindPauseButtonWithObjects(infoColumn.pauseButton, resultScene.scene, [gameBoxInfo.crypt_key, gameBoxInfo.message], director, hookActive);

    // Bind default help button (do nothing).
    bindHelpButtonByDefault(infoColumn.helpButton, director, hookActive, helpEvent);


    /**
     * Add each element to its scene.
     */
    resultScene.scene.addChild(resultScene['game_box'].gameBox);

    /**
     * Set the resize callback to call.
     */
    resultScene['resize'] = resizeCreateKeyScene;

    resizeCreateKeyScene(director, resultScene);
    return resultScene;
}
