/********************************************************************
 * Ensure that below files are included (in the same order) for the *
 * good behavior of this piece of code :                            *
 *     - message_columns.js                                         *
 *     - key_columns.js                                             *
 *     - menu_screen.js                                             *
 *     - play_scene.js                                              *
 *******************************************************************/

function ia_create_pk(createKeyScene, gameBoxInfo) {	              
    var prepare_move = [];
    var move = [];

    var current_time = 0;
    var WAITING_TIME = 100;//250;

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
                    key.oldKeyDown();
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

    DEFAULT_SQUARE_WIDTH = 40;
    DEFAULT_COLUMN_WIDTH = DEFAULT_SQUARE_WIDTH + 3;

    var canvasWidth = ((DEFAULT_SQUARE_WIDTH + 4) * createKeyScene.game_box.current_length + 2 * 8) + 2 * 60 + 260;

    while (canvasWidth > $(document).width() && DEFAULT_SQUARE_WIDTH > 10) {
        --DEFAULT_SQUARE_WIDTH;
        --DEFAULT_COLUMN_WIDTH;
        canvasWidth = ((DEFAULT_SQUARE_WIDTH + 4) * createKeyScene.game_box.current_length + 2 * 8) + 2 * 60 + 260;
    }

    createKeyScene.game_box.relativeX = parseInt(director.width / 2 - canvasWidth / 2) + 40;
    createKeyScene.game_box.resize(createKeyScene.scene, createKeyScene.leftPlayerName, createKeyScene.centerPlayerName, createKeyScene.rightPlayerName, createKeyScene.info_column);

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
    var scene = director.createScene();
	resultScene.scene = scene;
	 
    /**
     * Define the current length of the message (and of the keys).
     */
    var current_length = MAX_BOARD_LENGTH;

    /**
     * Generate my private and public keys.
     */
    currentGame.playerKeyInfo = getKeyInfo(current_length);

    var canvasWidth = ((DEFAULT_SQUARE_WIDTH + 4) * current_length + 2 * 8) + 2 * 40 + 260;

    while (canvasWidth > $(document).width() && DEFAULT_SQUARE_WIDTH > 10) {
        --DEFAULT_SQUARE_WIDTH;
        --DEFAULT_COLUMN_WIDTH;
        canvasWidth = ((DEFAULT_SQUARE_WIDTH + 4) * current_length + 2 * 8) + 2 * 40 + 260;
    }

    /**
     * Define an empty message.
     */
    var tmp_empty_message = [];
    for (var i = 0; i < current_length; ++i) {
        tmp_empty_message.push(0);
    }
    var empty_message = chiffre(current_length, tmp_empty_message, tmp_empty_message);

    /**
     * Position relative of the game box to the screen. 
     */
    var canvasWidth = ((DEFAULT_SQUARE_WIDTH + 4) * current_length + 2 * 8) + 2 * 60 + 260;

    var gameBoxInfo = new GameBox(director, new GameBoxOption(), parseInt(director.width / 2 - canvasWidth / 2) + 30, 80, current_length, currentGame.playerKeyInfo['private_key'], empty_message, true);
    var crypt_key = gameBoxInfo.crypt_key;
    resultScene['game_box'] = gameBoxInfo;


    var leftPlayerName = new CAAT.Foundation.Actor().
                            setBackgroundImage(director.getImage('left-board')).
                            setLocation(resultScene['game_box'].gameBox.x - 12, resultScene['game_box'].gameBox.y - director.getImage('left-board').height - 10);

    var centerPlayerName = new CAAT.Foundation.ActorContainer().
                            setSize(175, director.getImage('center-board').height).
                            setBackgroundImage(director.getImage('center-board'), false).
                            setLocation(leftPlayerName.x + leftPlayerName.width, leftPlayerName.y);

    centerPlayerName.paint = function(director) {
        var ctx = director.ctx;
        var bg = ctx.createPattern(director.getImage('center-board'), "repeat");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    var playerNameText = new CAAT.Foundation.Actor().
                            setSize(175, director.getImage('center-board').height).
                            setLocation(0, 0);


    playerNameText.paint = function(director) {

        var ctx = director.ctx;

        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#00FF9D';

        ctx.font = '22px Quantico';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.fillText(currentGame.username, this.width / 2, this.height / 2 + 7);
    }

    centerPlayerName.addChild(playerNameText);
	playerNameText.cacheAsBitmap();

    var rightPlayerName = new CAAT.Foundation.Actor().
                            setBackgroundImage(director.getImage('right-board')).
                            setLocation(centerPlayerName.x + centerPlayerName.width, centerPlayerName.y);

    var infoColumn = new InfoColumn(director, resultScene, crypt_key);
    resultScene['info_column'] = infoColumn;

    /**
     * Add each element to its scene.
     */
    resultScene['scene'].addChild(resultScene['game_box'].gameBox);
    resultScene['scene'].addChild(leftPlayerName);
    resultScene['scene'].addChild(centerPlayerName);
    resultScene['scene'].addChild(rightPlayerName);

    resultScene['resize'] = resizeCreateKeyScene;
    resultScene['rightPlayerName'] = rightPlayerName;
    resultScene['centerPlayerName'] = centerPlayerName;
    resultScene['leftPlayerName'] = leftPlayerName;

    /**
     * Overwrite keyDown to not down the key but launch the create public key process.
     */
    resultScene.game_box.crypt_key.oldKeyDown = resultScene.game_box.crypt_key.keyDown;
    resultScene.game_box.crypt_key.keyDown = function() {
        if (currentGame.iaCreateKeyTimer === null) {
            ia_create_pk(resultScene['scene'], gameBoxInfo);
        }
    }
    resultScene['scene'].createTimer(resultScene['scene'].time, Number.MAX_VALUE, null,
        function(time, ttime, timerTask) {
/*
            var rivalMessage = rivalBoxInfo.message;
            var rivalBox = rivalBoxInfo.gameBox;
            if (rivalMessage.boxOption.endResolved === null && rivalMessage.resolved === true) {
                rivalMessage.boxOption.endResolved = time;

                var winScreen = new CAAT.Actor().
                        setSize(rivalBox.width, rivalBox.height).
                        setLocation(0, 0);

                winScreen.paint = function(director) {

                    var ctx = director.ctx;

                    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                    ctx.fillRect(0, 0, this.width, this.height);

                    ctx.strokeStyle = 'rgb(0, 0, 0)';
                    ctx.strokeRect(0, 0, this.width, this.height);

                    ctx.font = '30px sans-serif';
                    ctx.fillStyle = 'black';
                    ctx.fillText("Vous avez gagné en ", 10, this.height / 2 + 5);
                    ctx.fillText(time / 1000 + " secondes.", 10, this.height / 2 + 30);
                };
                rivalBox.addChild(winScreen);
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

                    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                    ctx.fillRect(0, 0, this.width, this.height);

                    ctx.strokeStyle = 'rgb(0, 0, 0)';
                    ctx.strokeRect(0, 0, this.width, this.height);

                    ctx.font = '30px sans-serif';
                    ctx.fillStyle = 'black';
                    ctx.fillText("Vous avez gagné en ", 10, this.height / 2 + 5);
                    ctx.fillText(time / 1000 + " secondes.", 10, this.height / 2 + 30);
                };
                gameBox.addChild(winScreen);
            }
        */
        }
    );
    resizeCreateKeyScene(director, resultScene);
    return resultScene;
}
