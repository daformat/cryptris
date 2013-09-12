/********************************************************************
 * Ensure that below files are included (in the same order) for the *
 * good behavior of this piece of code :                            *
 *     - message_columns.js                                         *
 *     - key_columns.js                                             *
 *     - menu_screen.js                                             *
 *     - play_scene.js                                              *
 *******************************************************************/

/**
 * This function create the button we use in this scene.
 * @param director {CAAT.Director}
 * @param width {number}
 * @param height {number}
 * @param text {string}
 * @param x {number}
 * @param y {number}
 * @param color {string}
 */
function createBackButton(director, width, height, text, x, y, color) {
    var backButton = new CAAT.Actor().
        setSize(width, height).
        centerAt(x, y);

    backButton.paint = function(director) {

        var ctx = director.ctx;

        ctx.fillStyle = this.pointed ? 'orange' : color;
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.strokeStyle = this.pointed ? 'red' : 'black';
        ctx.strokeRect(0, 0, this.width, this.height);

        ctx.font = '30px sans-serif';
        ctx.fillStyle = 'black';
        ctx.fillText(text, 10, this.height / 2 + 5);
    };

    return backButton;
}

function display_debug_message(director, boxOption, gameBox, current_length, message, container) {
    for (var i = 0; i < current_length; ++i) {

        var type = null;
        var initialNumber = 0;
        var gradient = null;

        if (message[i] == -1) {
            type = COLUMN_TYPE_2;
            initialNumber = 1;
        } else if (message[i] == 0) {
            type = COLUMN_TYPE_3;
            initialNumber = 0;
        } else {
            type = COLUMN_TYPE_1;
            initialNumber = 1;
        }

        if (type != COLUMN_TYPE_3) {
            gradient = director.ctx.createLinearGradient(0, 0, boxOption.SQUARE_WIDTH, 0);
            gradient.addColorStop(0, boxOption.ColorLeft[type]);
            gradient.addColorStop(1, boxOption.Color[type]);
        }

        for (var j = 0; j < initialNumber; ++j) {
            var shape = new CAAT.ShapeActor().setSize(boxOption.SQUARE_WIDTH, boxOption.SQUARE_HEIGHT)
                                                 .setFillStyle(gradient)
                                                 .setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE)
                                                 .setStrokeStyle(boxOption.StrokeColor[type])
                                                 .setLocation(gameBox.x + i * (boxOption.SPACE_WIDTH + boxOption.SQUARE_WIDTH) + boxOption.SPACE_WIDTH, gameBox.y + gameBox.height + 30);
            container.addChild(shape);
        }
    }
}

function createGameBox(director, boxOption, relativeX, relativeY, current_length, key_info, my_message, player) {
    var sizeWidth = current_length * (boxOption.SPACE_WIDTH + boxOption.COLUMN_WIDTH) - boxOption.SPACE_WIDTH + 2 * boxOption.BORDER_WIDTH;
    var sizeHeight = $(window).height() - 100;

    /**
     * Create the game box.
     */
    var gameBox = new CAAT.Foundation.ActorContainer()
                                    .setSize(sizeWidth, sizeHeight)
                                    .setFillStyle('rgba(0, 113, 187, 0.2)')
                                    .setLocation(relativeX, relativeY)
                                    .enableEvents(false);

    /**
     * Create each column and set their color.
     */
    for (var i = 0; i < current_length; ++i) {
        var column = new CAAT.ShapeActor().setSize(boxOption.COLUMN_WIDTH, gameBox.height - 2 * boxOption.BORDER_HEIGHT)
                                                 .setFillStyle(boxOption.columnColor)
                                                 .setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE)
                                                 .setLocation(boxOption.BORDER_WIDTH + i * (boxOption.COLUMN_WIDTH + boxOption.SPACE_WIDTH), boxOption.BORDER_HEIGHT);
        gameBox.addChild(column);
    }

    /**
     * Create my message object.
     * This object inserts all necessary columns to gameBox.
     */
    var message = new Message(director, current_length, my_message, gameBox, boxOption);
    message.createMessage();

    /**
     * Create my key object.
     * This object inserts all necessary columns to gameBox.
     */
    var crypt_key = new Key(key_info, current_length, message, gameBox, director, boxOption, player);
    crypt_key.createKey();
    message.redraw();
    crypt_key.redraw();

    return {'game_box' : gameBox, 'crypt_key' : crypt_key, 'message' : message};
}

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

    var message = rivalBoxInfo['message'];
    var key = rivalBoxInfo['crypt_key'];

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

            if (key.msgColumn.resolved === false && key.keyInMove === false) {

                console.log(move);
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

    /**
     * Position relative of the game box to the screen. 
     */
    var gameBoxInfo = createGameBox(director, new GameBoxOption(), 40, 30, current_length, key_info_t[getQuerystring("key", 'private_key')], my_message, true);
    var crypt_key = gameBoxInfo['crypt_key'];
    resultScene['game_box'] = gameBoxInfo['game_box'];


    var padPositionY = 100;
    if (resultScene['game_box'].height / 2 - 300 > 100) {
        padPositionY = resultScene['game_box'].height / 2 - 300;
    }
    var cryptrisLogo = new CAAT.Foundation.Actor().
                            setBackgroundImage(director.getImage('logo-board')).
                            setLocation(resultScene['game_box'].width + 50, padPositionY).
                            setSize(240, 110);

    var pad = new CAAT.Actor().setSize(155, 152)
                    .setBackgroundImage(director.getImage('pad-untouched'))
                    .setLocation(cryptrisLogo.x + 45, cryptrisLogo.y + cryptrisLogo.height + 20);

    pad.mouseDown = function(e) {
        var theta = Math.PI / 4;
        var x2 = (e.x - pad.width / 2) * Math.cos(theta) + (e.y - pad.height / 2) * Math.sin(theta);
        var y2 = (e.y - pad.height / 2) * Math.cos(theta) - (e.x - pad.width / 2) * Math.sin(theta);        
        if (x2 * x2 + y2 * y2 <= 70 * 70) {

            if (x2 < 0 && y2 > 0) {
                pad.setBackgroundImage(director.getImage('pad-left'));
                crypt_key.rotateLeft();
            }
            if (x2 > 0 && y2 < 0) {
                pad.setBackgroundImage(director.getImage('pad-right'));
                crypt_key.rotateRight();
            }
            if (x2 > 0 && y2 > 0) {
                pad.setBackgroundImage(director.getImage('pad-down'));
                crypt_key.keyDown();
            }
            if (x2 < 0 && y2 < 0) {
                pad.setBackgroundImage(director.getImage('pad-up'));
                crypt_key.changeKeyType();
            }
        }
    }

    pad.mouseUp = function(mouseEvent) {
        pad.setBackgroundImage(director.getImage('pad-untouched'));
    }

    var rivalBoxInfo = createGameBox(director, new RivalBoxOption(), 300 + resultScene['game_box'].width, 30, current_length, key_info_t['public_key'], my_message, false);
    resultScene['rival_box'] = rivalBoxInfo['game_box'];


    /**
     * Create the play scene, and set the background Image (see main.js => Image assets").
     */
    resultScene['scene'] = director.createScene();


    /**
     * Display our message for debug.
     */
    display_debug_message(director, new GameBoxOption(), resultScene['game_box'], current_length, tmp_message, resultScene['scene']);

    /**
     * Create each necessary button.
     */
    resultScene['back_button'] = createBackButton(director, 120, 40, "Back", director.width - 70, director.height - 100, "red");

    /**
     * Add each element to its scene.
     */
    resultScene['scene'].addChild(resultScene['game_box']);
    resultScene['scene'].addChild(resultScene['rival_box']);
    resultScene['scene'].addChild(cryptrisLogo);
    resultScene['scene'].addChild(pad);
    /*
    resultScene['scene'].addChild(resultScene['back_button']);
    */

    /*
     * Call the IA script.
     */
    handle_ia(resultScene['scene'], rivalBoxInfo);


    resultScene['scene'].createTimer(this.container.time, Number.MAX_VALUE, null,
        function(time, ttime, timerTask) {
            resultScene['scene'].setPaused(rivalBoxInfo['message'].boxOption.paused);

            var rivalMessage = rivalBoxInfo['message'];
            var rivalBox = rivalBoxInfo['game_box'];

            var gameMessage = gameBoxInfo['message'];
            var gameBox = gameBoxInfo['game_box'];

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
