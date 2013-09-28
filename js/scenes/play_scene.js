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
    var WAITING_TIME = 250;

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

    playScene.createTimer(0, Number.MAX_VALUE, null,
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
            }
        }
    );
}

function resizePlayScene(director, playScene) {

    playScene.game_box.relativeX = getRelativeX(playScene.resizeOption);
    playScene.game_box.resize(playScene.scene, playScene.info_column);

    playScene.rival_box.relativeX = playScene.game_box.gameBox.x + 260 + playScene.game_box.gameBox.width;
    playScene.rival_box.resize(playScene.scene);

}

/**
 * This function all elements for the play scene.
 * @param director {CAAT.Director}
 */
function createPlayScene(director) {
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
        currentGame.playSceneActive = true;
    }
	 
    /**
     * Define the current length of the message (and of the keys).
     */
    var current_length = parseInt(getQuerystring("n", 8));

    /**
     * Generate my private and public keys.
     */
    var key_info_t = getKeyInfo(current_length);

    /**
     * Define a TEMPORARY message.
     */
    var tmp_message = [];
    for (var i = 0; i < current_length; ++i) {
        tmp_message.push(Math.floor(Math.random() * 3 - 1));
    }
    var my_message = chiffre(current_length, tmp_message, key_info_t['public_key']['key']);

    resultScene.resizeOption = new ResizeOption(current_length, 2);

    /**
     * Create the player game board.
     */
    var playerBoxOption = new BoxOption(resultScene.scene, resultScene.resizeOption, playerBoardColorInfo);
    var gameBoxInfo = new GameBox(director, playerBoxOption, getRelativeX(resultScene.resizeOption), 80, current_length, key_info_t.private_key, my_message, true);
    resultScene['game_box'] = gameBoxInfo;

    /**
     * Create the central column (to display some information).
     */
    var infoColumn = new InfoColumn(director, resultScene, gameBoxInfo.crypt_key);
    resultScene['info_column'] = infoColumn;

    /**
     * Create the ia board.
     */
    var rivalBoxOption = new BoxOption(resultScene.scene, resultScene.resizeOption, iaBoardColorInfo);
    var rivalBoxInfo = new GameBox(director, rivalBoxOption, resultScene.game_box.gameBox.x + 260 + resultScene.game_box.gameBox.width, 80, current_length, key_info_t.public_key, my_message, false);
    resultScene['rival_box'] = rivalBoxInfo;

    /*
     * Bind each element of the scene with controls (mouse and keyboard.)
     */
    
    // Bind the key with keyboard controls.
    bindPlayerKeyWithKeyboard(gameBoxInfo.crypt_key, 'playSceneActive');

    // Bind infoColumn pad with controls.
    bindPadWithKey(infoColumn.pad, director, gameBoxInfo.crypt_key, 'playSceneActive');
    bindPadWithKeyboard(infoColumn.pad, director, 'playSceneActive');

    // Bind all objects with pause Buttons.
    var objectsWithAnimation = [gameBoxInfo.crypt_key, rivalBoxInfo.crypt_key, gameBoxInfo.message, rivalBoxInfo.message];
    bindPauseButtonWithObjects(infoColumn.pauseButton, resultScene.scene, objectsWithAnimation, director, 'playSceneActive');

    // Bind default help button (do nothing).
    bindHelpButtonByDefault(infoColumn.helpButton, director, 'playSceneActive');

    /**
     * Add each element to its scene.
     */
    resultScene.scene.addChild(resultScene['game_box'].gameBox);
    resultScene.scene.addChild(resultScene['rival_box'].gameBox);

    /**
     * Set the resize callback to call.
     */
    resultScene['resize'] = resizePlayScene;

    /*
     * Call the IA script.
     */
    handle_ia(resultScene['scene'], rivalBoxInfo);

    resultScene['scene'].createTimer(resultScene['scene'].time, Number.MAX_VALUE, null,
        function(time, ttime, timerTask) {

            var rivalMessage = rivalBoxInfo.message;
            var rivalBox = rivalBoxInfo.gameBox;
            if (rivalMessage.boxOption.endResolved === null && rivalMessage.resolved === true) {
                rivalMessage.boxOption.endResolved = time; 
                var rivalWinScreen = new CAAT.Actor().
                        setSize(rivalBox.width, rivalBox.height).
                        setLocation(0, 0);

                rivalWinScreen.paint = function(director) {

                    var ctx = director.ctx;

                    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    ctx.fillRect(0, 0, this.width, this.height);
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    ctx.fillRect(this.width / 2 - 100, this.height / 2 - 30, 200, 50);

                    ctx.strokeStyle = 'rgb(0, 0, 0)';
                    ctx.strokeRect(0, 0, this.width, this.height);
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = '#00FF9D';

                    ctx.font = '14pt Inconsolata';
                    ctx.fillStyle = '#00e770';
                    ctx.textAlign = 'center';
                    ctx.fillText("Message décrypté.", this.width / 2, this.height / 2);
                }
                rivalBox.addChild(rivalWinScreen);
            }


            var gameMessage = gameBoxInfo.message;
            var gameBox = gameBoxInfo.gameBox;
            if (gameMessage.boxOption.endResolved === null && gameMessage.resolved === true) {
                gameMessage.boxOption.endResolved = time; 
                var winScreen = new CAAT.Actor().
                        setSize(gameBox.width, gameBox.height).
                        setLocation(0, 0);
                winScreen.paint = function(director) {

                    var ctx = director.ctx;

                    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    ctx.fillRect(0, 0, this.width, this.height);
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    ctx.fillRect(this.width / 2 - 100, this.height / 2 - 30, 200, 50);

                    ctx.strokeStyle = 'rgb(0, 0, 0)';
                    ctx.strokeRect(0, 0, this.width, this.height);
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = '#00FF9D';

                    ctx.font = '14pt Inconsolata';
                    ctx.fillStyle = '#00e770';
                    ctx.textAlign = 'center';
                    ctx.fillText("Message décrypté.", this.width / 2, this.height / 2);
                }
                gameBox.addChild(winScreen);
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
