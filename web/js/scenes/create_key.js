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

    playScene.createTimer(this.container.time, Number.MAX_VALUE, null,
        function(time, ttime, timerTask) {

            if (key.msgColumn.resolved === false && key.keyInMove === false && key.keyFirstMove === false) {
                /**
                 * TO PRECISE : We apply -2 key at all columns of the message.
                 */
                if (actionToDo === ACTION_UNKNOWN && moveIsPrepared !== true) {
                    if (actionToDo === ACTION_UNKNOWN) {
                        if (keyIsInvert !== true) {
                            actionToDo = ACTION_INVERT;
                        }
                        else if (move[index] !== -2) {
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
                }

                else if (actionToDo === ACTION_UNKNOWN && moveIsPrepared === true) {
                    
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
                    }
                    else {
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

    DEFAULT_SQUARE_WIDTH = 40;
    DEFAULT_COLUMN_WIDTH = DEFAULT_SQUARE_WIDTH + 3;

    var canvasWidth = 2 * ((DEFAULT_SQUARE_WIDTH + 4) * playScene['game_box'].current_length + 2 * 8) + 2 * 40 + 260;

    while (canvasWidth > $(document).width() && DEFAULT_SQUARE_WIDTH > 10) {
        --DEFAULT_SQUARE_WIDTH;
        --DEFAULT_COLUMN_WIDTH;
        canvasWidth = 2 * ((DEFAULT_SQUARE_WIDTH + 4) * playScene['game_box'].current_length + 2 * 8) + 2 * 40 + 260;
    }

    playScene['game_box'].relativeX = parseInt(director.width / 2 - canvasWidth / 2);
    playScene['game_box'].resize();


    playScene['leftPlayerName'].setLocation(playScene['game_box'].gameBox.x - 12, playScene['game_box'].gameBox.y - director.getImage('left-board').height - 10);
    playScene['centerPlayerName'].setLocation(playScene['leftPlayerName'].x + playScene['leftPlayerName'].width, playScene['leftPlayerName'].y);
    playScene['rightPlayerName'].setLocation(playScene['centerPlayerName'].x + playScene['centerPlayerName'].width, playScene['centerPlayerName'].y);

    playScene['info_column'].infoColumnContainer.centerAt(playScene['game_box'].gameBox.x + playScene['game_box'].gameBox.width + 130, 80 + playScene['game_box'].gameBox.height / 2);
}

/**
 * This function all elements for the play scene.
 * @param director {CAAT.Director}
 */
function createKeyScene(director) {
    /**
     * Create the dict to return.
     */
    var resultScene = {};
    /**
     * Create the play scene.
     */
    resultScene['scene'] = director.createScene();

    /**
     * Define the current length of the message (and of the keys).
     */
    var current_length = parseInt(getQuerystring("n", 8));

    /**
     * Generate my private and public keys.
     */
     var key_info_t = getKeyInfo(current_length);

    var canvasWidth = 2 * ((DEFAULT_SQUARE_WIDTH + 4) * current_length + 2 * 8) + 2 * 40 + 260;

    while (canvasWidth > $(document).width() && DEFAULT_SQUARE_WIDTH > 10) {
        --DEFAULT_SQUARE_WIDTH;
        --DEFAULT_COLUMN_WIDTH;
        canvasWidth = 2 * ((DEFAULT_SQUARE_WIDTH + 4) * current_length + 2 * 8) + 2 * 40 + 260;
    }

    /**
     * Define a TEMPORARY message.
     */
    var tmp_message = [];
    for (var i = 0; i < current_length; ++i) {
        tmp_message.push(0);
    }
    var my_message = chiffre(0, tmp_message, key_info_t['public_key']['key']);

    /**
     * Position relative of the game box to the screen. 
     */
    var canvasWidth = 2 * ((DEFAULT_SQUARE_WIDTH + 4) * current_length + 2 * 8) + 2 * 40 + 260;

    var gameBoxInfo = new GameBox(director, new GameBoxOption(), parseInt(director.width / 2 - canvasWidth / 2), 80, current_length, key_info_t[getQuerystring("key", 'private_key')], my_message, true);
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

    resultScene['resize'] = resizePlayScene;
    resultScene['rightPlayerName'] = rightPlayerName;
    resultScene['centerPlayerName'] = centerPlayerName;
    resultScene['leftPlayerName'] = leftPlayerName;

    resultScene['scene'].createTimer(resultScene['scene'].time, Number.MAX_VALUE, null,
        function(time, ttime, timerTask) {

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
        }
    );

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
