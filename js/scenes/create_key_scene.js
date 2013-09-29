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
    var index = 0;

    var keyIsInvert = false;
    var moveIsPrepared = false;

    var alignColumn = false;
    var progress = true;

    currentGame.iaCreateKeyTimer = createKeyScene.createTimer(0, Number.MAX_VALUE, null,
        function(time, ttime, timerTask) {
            if (index < move.length && key.keyInMove === false && key.keyFirstMove === false) {
                if (actionToDo === ACTION_UNKNOWN) {

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
            } else if (index === move.length) {
                currentGame.iaCreateKeyTimer.cancel();

                message.upMessage();
                key.hidden();
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
                resetPublicKey(newPk);
            }
        }
    );
}

function resizeCreateKeyScene(director, createKeyScene) {
    createKeyScene.game_box.relativeX = getRelativeX(createKeyScene.resizeOption);
    createKeyScene.game_box.resize(createKeyScene.scene)

    createKeyScene.info_column.redraw();
}

/**
 * This function all elements for the play scene.
 * @param director {CAAT.Director}
 */
function createCreateKeyScene(director) {
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
    }
     
    /**
     * Define the current length of the message (and of the keys).
     */
    var current_length = MAX_BOARD_LENGTH;

    /**
     * Generate my private and public keys.
     */
    currentGame.playerKeyInfo = getKeyInfo(current_length);

    /**
     * Define an empty message.
     */
    var tmp_empty_message = [];
    for (var i = 0; i < current_length; ++i) {
        tmp_empty_message.push(0);
    }
    var empty_message = chiffre(current_length, tmp_empty_message, tmp_empty_message);

    resultScene.resizeOption = new ResizeOption(current_length, 1);

    /**
     * Create the player game board.
     */
    var playerBoxOption = new BoxOption(resultScene.scene, resultScene.resizeOption, playerBoardColorInfo, createKeySceneTime);
    var gameBoxInfo = new GameBox(director, playerBoxOption, getRelativeX(resultScene.resizeOption), resultScene.resizeOption.DEFAULT_RELATIVE_Y, current_length, currentGame.playerKeyInfo.private_key, empty_message, true);
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
    bindCKPlayerKeyWithKeyboard(ia_create_pk, resultScene.scene, gameBoxInfo, 'createKeySceneActive')

    // Bind infoColumn pad with controls.
    bindCKPadWithKey(infoColumn.pad, director, ia_create_pk, resultScene.scene, gameBoxInfo, 'createKeySceneActive');
    bindPadWithKeyboard(infoColumn.pad, director, 'createKeySceneActive');

    // Bind all objects with pause Buttons.
    bindPauseButtonWithObjects(infoColumn.pauseButton, resultScene.scene, [gameBoxInfo.crypt_key, gameBoxInfo.message], director, 'createKeySceneActive');

    // Bind default help button (do nothing).
    bindHelpButtonByDefault(infoColumn.helpButton, director, 'createKeySceneActive');


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
